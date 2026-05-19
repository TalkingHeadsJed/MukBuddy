#!/usr/bin/env bash
#
# Non-daemonized startup command for Pair supervisord.
#
# What it does:
#   1. cd to the backend directory so server.py + db.py can be imported
#   2. Run uvicorn in the foreground (supervisord handles restart-on-crash + logs)
#   3. Bind ONLY to 127.0.0.1 so the app is NOT exposed to the public internet
#      directly — only Apache's reverse proxy can talk to it.
#
# Edit ONLY these two paths if the install location is different from defaults:
APP_DIR="${APP_DIR:-/home/mukbuddy/app}"
VENV_PYTHON="${VENV_PYTHON:-$APP_DIR/.venv/bin/python}"

set -euo pipefail

cd "$APP_DIR/backend"

# uvicorn reads env vars from the process environment.
# supervisord will inject them via [program] environment= or via env file.
# (We do NOT source .env here so secrets aren't logged into process listings.)

exec "$VENV_PYTHON" -m uvicorn server:app \
    --host 127.0.0.1 \
    --port 8001 \
    --workers 2 \
    --proxy-headers \
    --forwarded-allow-ips=127.0.0.1 \
    --log-level info \
    --no-server-header
