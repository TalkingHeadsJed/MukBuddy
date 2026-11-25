#!/bin/bash
# scripts/check-fraud-tracker.sh — fail if a built page lacks the Fraud Blocker tracker.
#
# Usage: check-fraud-tracker.sh <build-dir> [--all]
#   Default: checks the top-level pages (/, /ads, /about, /thank-you).
#   --all:   checks every *.html under the build dir (use after a blog build).
#   The tracker lives in frontend/public/index.html and scripts/build-blog.js
#   (added 2026-11-25 at Jed's request). If this fails after an Emergent
#   "Save to GitHub", the tracker was overwritten: put it back, don't skip this.
set -euo pipefail
dir="${1:?usage: $0 <build-dir> [--all]}"
sid="fbt.js?sid=M85pVho01o0MBYobNUK6S"
if [ "${2:-}" = "--all" ]; then
  files=$(find "$dir" -name '*.html' -not -path '*/draft-preview/*')
else
  files=$(ls "$dir"/index.html "$dir"/{ads,about,thank-you}/index.html 2>/dev/null || true)
fi
[ -n "$files" ] || { echo "FAIL: no html under $dir" >&2; exit 1; }
missing=$(grep -LF "$sid" $files || true)
if [ -n "$missing" ]; then
  echo "FAIL: Fraud Blocker tracker missing from:" >&2; echo "$missing" >&2; exit 1
fi
echo "OK: Fraud Blocker tracker on $(wc -w <<<"$files") page(s)"
