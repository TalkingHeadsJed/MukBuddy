#!/usr/bin/env bash
set -u
HOME_DIR="${HOME:-/usr/home/working}"
MUKBUDDY="$HOME_DIR/mukbuddy"
LOGDIR="$HOME_DIR/logs/mukbuddy"
SESSION="mukbuddy"

mkdir -p "$LOGDIR"

if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "Mukbuddy already running (tmux session: $SESSION)"
    exit 0
fi

tmux new-session -d -s "$SESSION" -n api \
    "/usr/local/bin/bash -c '$MUKBUDDY/deploy/run-mukbuddy-api.sh >> $LOGDIR/uvicorn.log 2>&1'"

sleep 1

tmux new-window -t "$SESSION" -n tunnel \
    "/usr/local/bin/bash -c '$HOME_DIR/bin/cloudflared tunnel --config $HOME_DIR/.cloudflared/mukbuddy-config.yml run mukbuddy-api >> $LOGDIR/cloudflared.log 2>&1'"

tmux new-window -t "$SESSION" -n webhook \
    "/usr/local/bin/bash -c '/bin/python3 $MUKBUDDY/deploy/webhook-listener.py >> $LOGDIR/webhook.log 2>&1'"

echo "Mukbuddy started (tmux session: $SESSION, windows: api + tunnel + webhook)"
