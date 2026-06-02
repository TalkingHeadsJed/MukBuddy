#!/usr/local/bin/bash
#
# deploy-mukbuddy.sh - one-command deploy of the Muk Buddy site to the live Pair host.
#
# Pipeline:  git pull --ff-only  ->  build frontend (CRACO)  ->  atomic swap into
#            public_html/mukbuddy.com (preserving .htaccess + .well-known)  ->
#            restart backend API iff backend/ or deploy/ changed.
#
# The live frontend is a STATIC build served by Apache; the backend is uvicorn
# behind the Cloudflare tunnel https://mukbuddy-api.tal.one (kept alive by
# mukbuddy_watchdog.sh). Emergent only pushes SOURCE to GitHub - it does NOT
# touch this host. This script is the GitHub -> live-site bridge.
#
# Usage:
#   deploy-mukbuddy.sh                pull, build, deploy; restart API iff backend changed
#   deploy-mukbuddy.sh --no-pull      build & deploy the current tree (skip git pull)
#   deploy-mukbuddy.sh --restart-api  force a backend API restart
#   deploy-mukbuddy.sh --dry-run      pull + build only; do NOT touch live webroot/backend
#   deploy-mukbuddy.sh --rollback     restore the most recent pre-deploy webroot snapshot
#
set -euo pipefail
export PATH="/usr/local/bin:$HOME/bin:/bin:/usr/bin:$PATH"

# -- config --------------------------------------------------------------
REPO="$HOME/mukbuddy"
FRONTEND="$REPO/frontend"
WEBROOT="$HOME/public_html/mukbuddy.com"
BACKEND_URL="${BACKEND_URL:-https://mukbuddy-api.tal.one}"
SITE_URL="${SITE_URL:-https://mukbuddy.com}"
SESSION="mukbuddy"
LOGDIR="$HOME/logs/mukbuddy"
API_LOG="$LOGDIR/uvicorn.log"
BACKUP_DIR="$HOME/backups/mukbuddy"
KEEP_SNAPSHOTS=3
TS="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$LOGDIR" "$BACKUP_DIR"
LOG="$LOGDIR/deploy_$TS.log"
exec > >(tee -a "$LOG") 2>&1

say() { echo "[deploy $(date +%H:%M:%S)] $*"; }
die() { echo "[deploy ERROR] $*" >&2; exit 1; }

DO_PULL=1 DRY_RUN=0 FORCE_API=0 ROLLBACK=0
for a in "$@"; do
  case "$a" in
    --no-pull)     DO_PULL=0 ;;
    --dry-run)     DRY_RUN=1 ;;
    --restart-api) FORCE_API=1 ;;
    --rollback)    ROLLBACK=1 ;;
    -h|--help)     sed -n '2,18p' "$0" | sed 's/^#\{0,1\} \{0,1\}//'; exit 0 ;;
    *)             die "unknown arg: $a (try --help)" ;;
  esac
done

# -- rollback ------------------------------------------------------------
if [ "$ROLLBACK" = 1 ]; then
  latest="$(ls -1dt "$BACKUP_DIR"/webroot.* 2>/dev/null | grep -v FAILED | head -1 || true)"
  [ -n "$latest" ] || die "no snapshot found in $BACKUP_DIR"
  say "rollback: restoring $latest -> $WEBROOT"
  mv "$WEBROOT" "$BACKUP_DIR/webroot.replaced.$TS"
  cp -a "$latest" "$WEBROOT"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$SITE_URL/" || echo 000)"
  say "rolled back. live $SITE_URL -> HTTP $code"
  exit 0
fi

# -- preflight -----------------------------------------------------------
[ -d "$REPO/.git" ] || die "repo not found at $REPO"
[ -d "$FRONTEND" ]  || die "frontend dir not found at $FRONTEND"
[ -d "$WEBROOT" ]   || die "webroot not found at $WEBROOT"
for t in node yarn rsync curl; do command -v "$t" >/dev/null || die "$t not on PATH"; done

cd "$REPO"
OLD_HEAD="$(git rev-parse --short HEAD)"

# -- pull ----------------------------------------------------------------
if [ "$DO_PULL" = 1 ]; then
  say "git pull --ff-only origin main (HEAD $OLD_HEAD)"
  git pull --ff-only origin main \
    || die "pull failed: local branch diverged from origin/main. Resolve manually, then re-run."
else
  say "skip git pull (--no-pull); building HEAD $OLD_HEAD"
fi
NEW_HEAD="$(git rev-parse --short HEAD)"

RESTART_API=$FORCE_API
if [ "$OLD_HEAD" != "$NEW_HEAD" ] && git diff --name-only "$OLD_HEAD" "$NEW_HEAD" | grep -qE '^(backend/|deploy/)'; then
  RESTART_API=1
  say "backend/ or deploy/ changed in $OLD_HEAD..$NEW_HEAD -> will restart API"
fi

# -- build ---------------------------------------------------------------
say "yarn install + build (REACT_APP_BACKEND_URL=$BACKEND_URL)"
cd "$FRONTEND"
yarn install 2>&1 | tail -15 || die "yarn install failed"
rm -rf build
CI=false GENERATE_SOURCEMAP=false REACT_APP_BACKEND_URL="$BACKEND_URL" yarn build 2>&1 | tail -20 \
  || die "yarn build failed"
[ -s build/index.html ] || die "build produced no index.html"

if grep -rqF "$BACKEND_URL" build/static/js/ 2>/dev/null; then
  say "verified: $BACKEND_URL baked into build JS"
else
  say "WARN: $BACKEND_URL NOT found in build JS - frontend may not reach the API"
fi
if ls build/static/js/*.map >/dev/null 2>&1 || ls build/static/css/*.map >/dev/null 2>&1; then
  say "stripping stray source maps from build"
  find build -name '*.map' -delete
fi

NEWJS="$(basename "$(ls build/static/js/main.*.js 2>/dev/null | head -1)" 2>/dev/null || echo '')"

if [ "$DRY_RUN" = 1 ]; then
  say "DRY RUN complete - build at $FRONTEND/build (main asset: ${NEWJS:-none}); live site untouched."
  exit 0
fi

# -- atomic deploy (stage -> swap), preserving .htaccess + .well-known ---
STAGE="$WEBROOT.staging.$TS"
say "staging new webroot at $STAGE"
rm -rf "$STAGE"; mkdir -p "$STAGE"
rsync -a build/ "$STAGE/"
[ -e "$WEBROOT/.htaccess" ]   && cp -a "$WEBROOT/.htaccess"   "$STAGE/"
[ -e "$WEBROOT/.well-known" ] && cp -a "$WEBROOT/.well-known" "$STAGE/"
# normalize perms so Apache can read (home umask is restrictive)
chmod 755 "$STAGE"
find "$STAGE" -type d -exec chmod 755 {} +
find "$STAGE" -type f -exec chmod 644 {} +

SNAP="$BACKUP_DIR/webroot.$TS"
say "swapping: $WEBROOT -> $SNAP, staging -> live"
mv "$WEBROOT" "$SNAP"
mv "$STAGE" "$WEBROOT"
say "deployed $NEW_HEAD -> $WEBROOT (snapshot: $SNAP)"

# -- verify frontend, auto-rollback on failure --------------------------
code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$SITE_URL/" || echo 000)"
say "live frontend $SITE_URL -> HTTP $code"
if [ "$code" != "200" ]; then
  say "ROLLBACK: frontend check failed (HTTP $code) - restoring snapshot"
  mv "$WEBROOT" "$BACKUP_DIR/webroot.FAILED.$TS"
  mv "$SNAP" "$WEBROOT"
  die "deploy rolled back; failed build kept at $BACKUP_DIR/webroot.FAILED.$TS"
fi
if [ -n "$NEWJS" ]; then
  curl -sS --max-time 20 "$SITE_URL/" 2>/dev/null | grep -qF "$NEWJS" \
    && say "verified: live index.html references new asset $NEWJS" \
    || say "note: live index.html did not reference $NEWJS (check manually)"
fi

# -- restart backend if needed ------------------------------------------
if [ "$RESTART_API" = 1 ]; then
  say "restarting backend API (tmux $SESSION:api)"
  if tmux has-session -t "$SESSION" 2>/dev/null; then
    tmux kill-window -t "$SESSION:api" 2>/dev/null || true
    tmux new-window -t "$SESSION" -n api \
      "/usr/local/bin/bash -c '$REPO/deploy/run-mukbuddy-api.sh >> $API_LOG 2>&1'"
  else
    say "tmux session missing - launching full stack via start-mukbuddy.sh"
    /usr/local/bin/bash "$REPO/deploy/start-mukbuddy.sh"
  fi
  sleep 4
  if pgrep -f "uvicorn server:app.*--port 8001" >/dev/null 2>&1; then
    say "backend uvicorn is running"
  else
    say "WARN: uvicorn not detected after restart (watchdog retries within 5 min)"
  fi
  bcode="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$BACKEND_URL/" 2>/dev/null || echo 000)"
  say "backend $BACKEND_URL/ -> HTTP $bcode (any non-000 = tunnel+app reachable)"
fi

# -- prune old snapshots -------------------------------------------------
mapfile -t olds < <(ls -1dt "$BACKUP_DIR"/webroot.20* 2>/dev/null || true)
if [ "${#olds[@]}" -gt "$KEEP_SNAPSHOTS" ]; then
  for d in "${olds[@]:$KEEP_SNAPSHOTS}"; do say "pruning old snapshot $d"; rm -rf "$d"; done
fi

say "DONE  $OLD_HEAD -> $NEW_HEAD | frontend HTTP $code | API restart: $([ "$RESTART_API" = 1 ] && echo yes || echo no)"
