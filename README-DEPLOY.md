# Muk Buddy — Pair VPS Deployment Guide

Everything you need for production. Hand this to your web guy.

---

## 0. What this app is

- **Frontend**: React SPA (built into static files — no Node needed in production)
- **Backend**: FastAPI app run by uvicorn under systemd, listening on `127.0.0.1:8001`
- **Database**: MySQL on Pair (already provisioned: `working_mukbuddy` on `localhost`)
- **Email**: Resend (transactional notifications to Jed@websitetalkingheads.com)

External traffic → Apache (HTTPS, 443) → either:
- Static React files (most URLs), **or**
- Reverse-proxied to FastAPI for `/api/*`

---

## 1. Prerequisites on the VPS

```bash
# As root:
apt update
apt install -y python3.11 python3.11-venv python3-pip mysql-client \
              apache2 certbot python3-certbot-apache
a2enmod proxy proxy_http headers rewrite ssl
```

Create a dedicated unprivileged user to run the app:

```bash
useradd -m -s /bin/bash mukbuddy
```

---

## 2. Drop the code on the server

Easiest: clone from GitHub. The Emergent "Save to GitHub" button has already pushed the repo.

```bash
sudo -u mukbuddy -i
cd ~
git clone https://github.com/<your-account>/<your-repo>.git app
cd app
```

---

## 3. Backend setup

```bash
# As the mukbuddy user, inside ~/app:
python3.11 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r backend/requirements.txt
```

Create `backend/.env` from the template:

```bash
cp backend/.env.production.example backend/.env
nano backend/.env
```

Set these values:
```
CORS_ORIGINS=https://mukbuddy.com,https://www.mukbuddy.com
DATABASE_URL=mysql+aiomysql://working_69_w:THE_REAL_PASSWORD@localhost:3306/working_mukbuddy
RESEND_API_KEY=re_xxxxxxxxxxxx
LEAD_NOTIFY_FROM=Muk Buddy <noreply@mukbuddy.com>
LEAD_NOTIFY_TO=Jed@websitetalkingheads.com
```

**Make sure `backend/.env` is `chmod 600`** so only the `mukbuddy` user can read it:
```bash
chmod 600 backend/.env
```

Quick smoke test (still as the `mukbuddy` user):
```bash
.venv/bin/python -c "from sqlalchemy import create_engine; \
  print(create_engine('mysql+pymysql://working_69_w:PASSWORD@localhost/working_mukbuddy').connect())"
```
If that prints a Connection object, MySQL is reachable. The `leads` table auto-creates on first server boot.

---

## 4. Install the systemd service

```bash
# Back to root:
cp /home/mukbuddy/app/deploy/mukbuddy-api.service /etc/systemd/system/
# Edit paths/user if they differ from the defaults in the file
systemctl daemon-reload
systemctl enable --now mukbuddy-api.service
systemctl status mukbuddy-api.service
```

You should see `Active: active (running)`. Logs:
```bash
journalctl -u mukbuddy-api -f
```

---

## 5. Frontend build

The frontend is already built locally (see `frontend/build/`). If you need to rebuild from source on the server:

```bash
# Requires Node 18+ and yarn:
cd ~/app/frontend
yarn install --frozen-lockfile
REACT_APP_BACKEND_URL=https://mukbuddy.com yarn build
```

Copy the build output to Apache's web root:
```bash
sudo mkdir -p /var/www/mukbuddy
sudo rsync -av --delete ~/app/frontend/build/ /var/www/mukbuddy/build/
sudo chown -R www-data:www-data /var/www/mukbuddy
```

---

## 6. Apache vhost

```bash
sudo cp /home/mukbuddy/app/deploy/apache-vhost.conf.example /etc/apache2/sites-available/mukbuddy.conf
sudo a2ensite mukbuddy
sudo a2dissite 000-default
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Then issue a Let's Encrypt cert:
```bash
sudo certbot --apache -d mukbuddy.com -d www.mukbuddy.com
sudo systemctl reload apache2
```

Certbot auto-renews via cron — no action needed.

---

## 7. DNS / Resend

- Point `mukbuddy.com` A record → your Pair VPS IP
- Point `www.mukbuddy.com` CNAME → `mukbuddy.com`
- **Resend domain records** (SPF, DKIM, DMARC) — already verified per Jed
- (Recommended) Put Cloudflare in front for free WAF + DDoS

---

## 8. Verify the live site

After Apache reloads with SSL:

1. https://mukbuddy.com loads, no SSL warnings
2. Click "Send Message" form → fill it out → submit
3. Verify:
   - Browser redirects to `https://mukbuddy.com/thank-you?lead_id=<uuid>`
   - Email arrives at Jed@websitetalkingheads.com within ~5 sec
   - Row appears in MySQL: `mysql -u working_69_w -p working_mukbuddy -e "SELECT id, name, email, created_at FROM leads ORDER BY created_at DESC LIMIT 1;"`

If all three pass, you're live.

---

## 9. Updating the site after launch

```bash
sudo -u mukbuddy -i
cd ~/app
git pull
.venv/bin/pip install -r backend/requirements.txt  # only if requirements changed
exit
sudo systemctl restart mukbuddy-api.service
# If the frontend was rebuilt locally and committed:
sudo rsync -av --delete /home/mukbuddy/app/frontend/build/ /var/www/mukbuddy/build/
```

---

## 10. Daily MySQL backup (recommended)

Drop this in `/etc/cron.daily/mukbuddy-leads-backup` (chmod 755):

```bash
#!/usr/bin/env bash
set -euo pipefail
DEST=/var/backups/mukbuddy
mkdir -p "$DEST"
mysqldump -u working_69_w -p'PASSWORD_HERE' working_mukbuddy leads \
  | gzip > "$DEST/leads-$(date +%F).sql.gz"
find "$DEST" -name 'leads-*.sql.gz' -mtime +30 -delete
```

(Lock down with `chmod 700` and `chown root:root` since it contains the DB password.)

---

## 11. Common gotchas

- **502 Bad Gateway on /api/**: `systemctl status mukbuddy-api` — usually the venv path in the service file is wrong or the `.env` is missing.
- **MySQL connection refused**: confirm MySQL is on `localhost` and the user has CREATE+INSERT+SELECT.
- **Email not arriving**: check `journalctl -u mukbuddy-api | grep email` — Resend errors are logged but never block the request.
- **Direct visit to `/thank-you` shows Apache 404**: the SPA fallback rewrite in the vhost isn't active. Confirm `mod_rewrite` is enabled.
- **CORS errors in browser console**: `CORS_ORIGINS` in `.env` must include the *exact* origin including https and www variants.
