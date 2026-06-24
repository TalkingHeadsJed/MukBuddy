#!/bin/bash
# scripts/sync-blog-from-github.sh
# ───────────────────────────────────────────────────────────────────────
# Pulls the latest /content/blog/*.md files from GitHub's main branch
# BEFORE we commit anything in this Emergent pod. Why:
#
#   Emergent's "Save to GitHub" does a force-push of main. If you've
#   been editing blog .md files directly in the GitHub web UI (e.g.,
#   adding video embeds, fixing typos), those edits would normally be
#   overwritten by Emergent's push because the local pod doesn't know
#   about them.
#
#   This script reads the raw .md files from the public GitHub repo
#   over HTTPS (no auth needed) and writes them to /app/content/blog/.
#   Run it AS THE FIRST STEP of any change to the codebase so the
#   subsequent commit includes the latest blog content. Then Emergent's
#   force-push preserves both your GitHub edits AND any other changes
#   made locally.
#
# Usage:   bash scripts/sync-blog-from-github.sh
# Cron:    not needed — agent runs it before every commit.
# ───────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO="TalkingHeadsJed/MukBuddy"
BRANCH="main"
LOCAL_DIR="/app/content/blog"
API_URL="https://api.github.com/repos/${REPO}/contents/content/blog?ref=${BRANCH}"
RAW_BASE="https://raw.githubusercontent.com/${REPO}/${BRANCH}/content/blog"

mkdir -p "${LOCAL_DIR}"

echo "→ Querying GitHub for current blog files on ${REPO}@${BRANCH}..."
LISTING_JSON="$(curl -fsSL "${API_URL}")"

# Parse the file names + SHAs from the API response
mapfile -t REMOTE_FILES < <(echo "${LISTING_JSON}" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for item in data:
    name = item.get('name','')
    sha = item.get('sha','')
    if name.endswith('.md'):
        print(f'{name}|{sha}')
")

if [ "${#REMOTE_FILES[@]}" -eq 0 ]; then
  echo '⚠ No blog .md files found on GitHub. Aborting (something is off).'
  exit 1
fi

UPDATED=0
UNCHANGED=0
NEW=0
for entry in "${REMOTE_FILES[@]}"; do
  name="${entry%%|*}"
  remote_sha="${entry##*|}"
  local_path="${LOCAL_DIR}/${name}"

  if [ -f "${local_path}" ]; then
    # Git "blob sha" is what GitHub also reports for content sha
    local_sha="$(git hash-object "${local_path}")"
    if [ "${local_sha}" = "${remote_sha}" ]; then
      UNCHANGED=$((UNCHANGED + 1))
      continue
    fi
    echo "  ↻ ${name} differs (local=${local_sha:0:8} vs github=${remote_sha:0:8}) — pulling GitHub version"
    UPDATED=$((UPDATED + 1))
  else
    echo "  + ${name} is NEW on GitHub — pulling"
    NEW=$((NEW + 1))
  fi

  curl -fsSL "${RAW_BASE}/${name}" -o "${local_path}"
done

# Also handle blog files that exist locally but were DELETED on GitHub
for local_file in "${LOCAL_DIR}"/*.md; do
  [ -f "${local_file}" ] || continue
  local_name="$(basename "${local_file}")"
  found=0
  for entry in "${REMOTE_FILES[@]}"; do
    if [ "${entry%%|*}" = "${local_name}" ]; then
      found=1
      break
    fi
  done
  if [ ${found} -eq 0 ]; then
    echo "  ✗ ${local_name} exists locally but NOT on GitHub — leaving in place (manual review)"
  fi
done

echo ""
echo "✓ Sync complete: ${NEW} new, ${UPDATED} updated, ${UNCHANGED} unchanged from GitHub."
echo "  Now safe to commit and push from Emergent."
