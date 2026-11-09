#!/bin/bash
# scripts/check-build-backend.sh — fail if a built bundle can't reach the API.
#
# Usage: check-build-backend.sh <build-dir | prebuilt .tar.gz>
#   Exits non-zero if the main JS bundle contains "undefined/api" or lacks the
#   expected API host. Run after every build and before every deploy.
#   Override the expected host with EXPECT_API_HOST.
set -euo pipefail
target="${1:?usage: $0 <build-dir|tarball>}"
host="${EXPECT_API_HOST:-mukbuddy-api.tal.one}"

if [ -d "$target" ]; then
  js=$(cat "$target"/static/js/main.*.js 2>/dev/null) || { echo "FAIL: no main.*.js under $target/static/js" >&2; exit 1; }
elif [ -f "$target" ]; then
  members=$(tar -tzf "$target" | grep -E '(^|/)static/js/main\.[^/]*\.js$') || { echo "FAIL: no main.*.js in $target" >&2; exit 1; }
  js=$(tar -xzOf "$target" $members)
else
  echo "FAIL: $target not found" >&2; exit 1
fi

if grep -qF 'undefined/api' <<<"$js"; then
  echo "FAIL: bundle contains \"undefined/api\" — REACT_APP_BACKEND_URL was not set at build time" >&2; exit 1
fi
if ! grep -qF "$host" <<<"$js"; then
  echo "FAIL: bundle does not reference $host — lead form would post elsewhere" >&2; exit 1
fi
echo "OK: bundle posts to $host"
