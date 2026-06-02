#!/usr/bin/env bash
#
# Non-daemonized startup for Muk Buddy FastAPI backend.
# Runs in a tmux session managed by mukbuddy_watchdog.sh.

set -euo pipefail

APP_DIR="${APP_DIR:-/usr/home/working/mukbuddy}"
VENV_PYTHON="${VENV_PYTHON:-$APP_DIR/.venv/bin/python}"
ENV_FILE="$APP_DIR/.env"

cd "$APP_DIR/backend"

# Robust .env loader — handles spaces, angle brackets, colons in values.
if [ -f "$ENV_FILE" ]; then
    while IFS='=' read -r raw_key raw_value || [ -n "$raw_key" ]; do
        case "$raw_key" in
            ''|\#*) continue ;;
        esac
        key="$(echo "$raw_key" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
        [ -z "$key" ] && continue
        value="${raw_value%\"}"; value="${value#\"}"
        value="${value%\'}"; value="${value#\'}"
        export "$key=$value"
    done < "$ENV_FILE"
else
    echo "FATAL: env file not found at $ENV_FILE" >&2
    exit 1
fi

: "${DATABASE_URL:?DATABASE_URL not set in .env}"
: "${RESEND_API_KEY:?RESEND_API_KEY not set in .env}"
: "${LEAD_NOTIFY_TO:?LEAD_NOTIFY_TO not set in .env}"

exec "$VENV_PYTHON" -m uvicorn server:app \
    --host 127.0.0.1 \
    --port 8001 \
    --workers 2 \
    --proxy-headers \
    --forwarded-allow-ips='127.0.0.1,::1' \
    --log-level info \
    --no-server-header
