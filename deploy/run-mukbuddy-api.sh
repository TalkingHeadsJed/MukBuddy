#!/usr/bin/env bash
#
# Non-daemonized startup command for Pair supervisord.
#
# What it does:
#   1. cd to the backend directory so server.py + db.py can be imported
#   2. Load backend/.env into the environment (Pair's supervisord doesn't do this)
#   3. Run uvicorn in the foreground (supervisord handles restart-on-crash + logs)
#   4. Bind ONLY to 127.0.0.1 so the app is NOT exposed to the public internet
#      directly — only Apache's reverse proxy can talk to it.

set -euo pipefail

APP_DIR="${APP_DIR:-/home/mukbuddy/app}"
VENV_PYTHON="${VENV_PYTHON:-$APP_DIR/.venv/bin/python}"
ENV_FILE="$APP_DIR/backend/.env"

cd "$APP_DIR/backend"

# ── Robust .env loader ──────────────────────────────────────────────
# Reads KEY=VALUE lines, ignores comments and blank lines, strips
# surrounding quotes, then exports. Safe with values that contain
# spaces, '<', '>', ':' etc. (e.g. `LEAD_NOTIFY_FROM=Muk Buddy <x@y.com>`).
if [ -f "$ENV_FILE" ]; then
    while IFS='=' read -r raw_key raw_value || [ -n "$raw_key" ]; do
        # skip comments
        case "$raw_key" in
            ''|\#*) continue ;;
        esac
        # strip leading/trailing whitespace from key
        key="$(echo "$raw_key" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
        [ -z "$key" ] && continue
        # strip surrounding double-quotes or single-quotes from value
        value="${raw_value%\"}"; value="${value#\"}"
        value="${value%\'}"; value="${value#\'}"
        export "$key=$value"
    done < "$ENV_FILE"
else
    echo "FATAL: env file not found at $ENV_FILE" >&2
    exit 1
fi

# Sanity check — refuse to start if a critical secret is missing.
: "${DATABASE_URL:?DATABASE_URL not set in .env}"
: "${RESEND_API_KEY:?RESEND_API_KEY not set in .env}"
: "${LEAD_NOTIFY_TO:?LEAD_NOTIFY_TO not set in .env}"

exec "$VENV_PYTHON" -m uvicorn server:app \
    --host 127.0.0.1 \
    --port 8001 \
    --workers 2 \
    --proxy-headers \
    --forwarded-allow-ips=127.0.0.1 \
    --log-level info \
    --no-server-header
