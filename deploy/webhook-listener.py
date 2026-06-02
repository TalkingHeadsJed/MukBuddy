#!/usr/bin/env python3
"""
webhook-listener.py - minimal GitHub push webhook -> deploy-mukbuddy.sh

Binds 127.0.0.1:WEBHOOK_PORT. Cloudflared forwards
https://mukbuddy-api.tal.one/__github-webhook here. Verifies the
X-Hub-Signature-256 HMAC against ~/.config/mukbuddy/webhook_secret and, on a
push to refs/heads/main, runs deploy-mukbuddy.sh in a background thread
(serialized by a lock). It NEVER executes anything derived from the request
body - only the fixed deploy script path.
"""
import hashlib
import hmac
import json
import os
import subprocess
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOME = os.path.expanduser("~")
PORT = int(os.environ.get("WEBHOOK_PORT", "9097"))
HOSTBIND = "127.0.0.1"
HOOK_PATH = "/__github-webhook"
WATCH_REF = "refs/heads/main"
SECRET_FILE = os.path.join(HOME, ".config", "mukbuddy", "webhook_secret")
DEPLOY = os.path.join(HOME, "mukbuddy", "deploy", "deploy-mukbuddy.sh")
DEPLOY_LOG = os.path.join(HOME, "logs", "mukbuddy", "webhook-deploy.log")
MAX_BODY = 5 * 1024 * 1024

with open(SECRET_FILE, "rb") as _f:
    SECRET = _f.read().strip()
if not SECRET:
    raise SystemExit("empty webhook secret in %s" % SECRET_FILE)

_deploy_lock = threading.Lock()


def log(msg):
    print("[%s] %s" % (time.strftime("%Y-%m-%dT%H:%M:%S"), msg), flush=True)


def valid_sig(body, header):
    if not header or not header.startswith("sha256="):
        return False
    sent = header.split("=", 1)[1].strip()
    expected = hmac.new(SECRET, body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sent)


def run_deploy(after, pusher):
    if not _deploy_lock.acquire(timeout=600):
        log("DEPLOY skipped (lock held >600s) after=%s" % after)
        return
    try:
        log("DEPLOY start after=%s pusher=%s" % (after, pusher))
        env = dict(os.environ)
        env["PATH"] = "/usr/local/bin:%s/bin:/bin:/usr/bin" % HOME
        with open(DEPLOY_LOG, "a") as dl:
            dl.write("\n===== webhook deploy after=%s pusher=%s =====\n" % (after, pusher))
            dl.flush()
            rc = subprocess.call(
                ["/usr/local/bin/bash", DEPLOY],
                stdin=subprocess.DEVNULL, stdout=dl, stderr=subprocess.STDOUT, env=env,
            )
        log("DEPLOY finished rc=%s after=%s" % (rc, after))
    except Exception as e:
        log("DEPLOY error: %r" % e)
    finally:
        _deploy_lock.release()


class Handler(BaseHTTPRequestHandler):
    server_version = "mukhook/1.0"

    def _reply(self, code, msg):
        data = (msg + "\n").encode()
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        try:
            self.wfile.write(data)
        except Exception:
            pass

    def _src(self):
        return self.headers.get("Cf-Connecting-Ip", self.client_address[0])

    def do_GET(self):
        if self.path == HOOK_PATH:
            self._reply(200, "ok")
        else:
            self._reply(404, "not found")

    def do_POST(self):
        if self.path != HOOK_PATH:
            self._reply(404, "not found")
            return
        try:
            length = int(self.headers.get("Content-Length", "0") or "0")
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            self._reply(400, "bad content-length")
            return
        body = self.rfile.read(length)
        event = self.headers.get("X-GitHub-Event", "")
        src = self._src()
        if not valid_sig(body, self.headers.get("X-Hub-Signature-256", "")):
            log("REJECT invalid signature from %s event=%s" % (src, event))
            self._reply(401, "invalid signature")
            return
        if event == "ping":
            log("PING ok from %s" % src)
            self._reply(200, "pong")
            return
        if event != "push":
            log("IGNORE event=%s from %s" % (event, src))
            self._reply(202, "ignored (not a push)")
            return
        try:
            payload = json.loads(body.decode("utf-8"))
        except Exception:
            self._reply(400, "bad json")
            return
        ref = payload.get("ref", "")
        if ref != WATCH_REF:
            log("IGNORE push ref=%s (watch %s) from %s" % (ref, WATCH_REF, src))
            self._reply(202, "ignored ref %s" % ref)
            return
        after = str(payload.get("after", ""))[:12]
        pusher = (payload.get("pusher") or {}).get("name", "?")
        log("ACCEPT push ref=%s after=%s pusher=%s from %s -> deploy" % (ref, after, pusher, src))
        threading.Thread(target=run_deploy, args=(after, pusher), daemon=True).start()
        self._reply(202, "deploy triggered")

    def log_message(self, *args):
        pass


def main():
    os.makedirs(os.path.dirname(DEPLOY_LOG), exist_ok=True)
    httpd = ThreadingHTTPServer((HOSTBIND, PORT), Handler)
    log("listening on %s:%d path=%s deploy=%s watch=%s" % (HOSTBIND, PORT, HOOK_PATH, DEPLOY, WATCH_REF))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
