# Muk Buddy — Deploy Checklist for Web Guy

Do these in order, top to bottom. Don't skip steps. Each step has the exact command to run.

If anything in a step fails, **STOP and reply with the error message** — don't try to fix it by changing later steps.

**What you'll have at the end:** a working `https://mukbuddy.com` with a working lead form that emails Jed and saves to MySQL.

---

## PART 1 — Set up the server (one time)

### Step 1. Check what OS the VPS is running

```
uname -a
```

If you see "Linux" → continue with this guide.
If you see "FreeBSD" → **STOP**. Tell Jed; some commands need different syntax.

### Step 2. Install system packages (as root)

```
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip git mysql-client apache2 certbot python3-certbot-apache
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo systemctl reload apache2
```

### Step 3. Create a dedicated user that will own the app

```
sudo useradd -m -s /bin/bash mukbuddy
```

### Step 4. Switch to that user

```
sudo -u mukbuddy -i
```

You are now logged in as the `mukbuddy` user. Your home directory is `/home/mukbuddy`.

All following commands run as `mukbuddy` UNTIL the guide tells you to switch back to root.

---

## PART 2 — Get the code and install the app

### Step 5. Clone the repo

Replace `<JED_GITHUB_REPO_URL>` with the GitHub URL Jed gives you.

```
cd ~
git clone <JED_GITHUB_REPO_URL> app
cd app
```

You should now be in `/home/mukbuddy/app`.

### Step 6. Build the Python virtualenv

```
cd /home/mukbuddy/app
python3.11 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r backend/requirements.txt
```

### Step 7. Create the backend `.env` file

Copy the template:

```
cp /home/mukbuddy/app/backend/.env.production.example /home/mukbuddy/app/backend/.env
```

Now edit it with your editor of choice:

```
nano /home/mukbuddy/app/backend/.env
```

Fill in the **real password** for the MySQL user `working_69_w` (Jed will give you this).
Leave the Resend API key value as-is — it's already correct.

Save and exit.

### Step 8. Lock down the env file

```
chmod 600 /home/mukbuddy/app/backend/.env
```

### Step 9. Test the MySQL connection

```
mysql -u working_69_w -p -h localhost working_mukbuddy -e "SELECT 1;"
```

Type the password. You should see `1` returned. If you get an Access Denied error, **STOP and report it**.

---

## PART 3 — Build the frontend

### Step 10. Install Node.js and yarn (still as `mukbuddy`)

```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
sudo npm install -g yarn
```

(The `sudo` calls will ask for your password — that's the root password for the box.)

### Step 11. Scrub Emergent dev tooling out of `index.html`

Open the file:

```
nano /home/mukbuddy/app/frontend/public/index.html
```

Find and delete these THREE blocks (they're near the bottom of the file):

a) The single line:
```
<script src="https://assets.emergent.sh/scripts/emergent-main.js"></script>
```

b) The entire `<a id="emergent-badge">...</a>` block (a "Made with Emergent" link with lots of inline style)

c) The entire `<script>` block at the bottom that contains `posthog.init(...)` — start from `<script>` and delete down to and including `</script>`

Save and exit.

### Step 12. Build the production frontend

```
cd /home/mukbuddy/app/frontend
yarn install --frozen-lockfile
REACT_APP_BACKEND_URL=https://mukbuddy.com yarn build
```

This takes 1–2 minutes. When it finishes there will be a `/home/mukbuddy/app/frontend/build/` folder.

---

## PART 4 — Put the frontend in Apache's webroot

### Step 13. Switch back to root

Type `exit` to leave the `mukbuddy` user. You're back to your normal sudo user.

### Step 14. Copy the build to Apache

```
sudo mkdir -p /var/www/mukbuddy
sudo rsync -av --delete /home/mukbuddy/app/frontend/build/ /var/www/mukbuddy/build/
sudo chown -R www-data:www-data /var/www/mukbuddy
```

### Step 15. Install the Apache vhost config

```
sudo cp /home/mukbuddy/app/deploy/apache-vhost.conf.example /etc/apache2/sites-available/mukbuddy.conf
sudo a2ensite mukbuddy
sudo a2dissite 000-default
sudo apache2ctl configtest
sudo systemctl reload apache2
```

The `configtest` line should say **"Syntax OK"**. If it doesn't, **STOP and report the error.**

---

## PART 5 — DNS and SSL

### Step 16. Make sure DNS points to this server

Confirm with Jed that `mukbuddy.com` and `www.mukbuddy.com` A-records point to this VPS's public IP.

You can verify:
```
dig +short mukbuddy.com
```
Should return the server's public IP.

### Step 17. Issue a Let's Encrypt SSL certificate

```
sudo certbot --apache -d mukbuddy.com -d www.mukbuddy.com
sudo systemctl reload apache2
```

When certbot asks "redirect HTTP to HTTPS?", pick **option 2 (yes, redirect)**.

### Step 18. Confirm the site loads over HTTPS

Open `https://mukbuddy.com` in your browser. You should see the Muk Buddy site. There should be no SSL warning.

---

## PART 6 — Get Pair to start the backend

### Step 19. Make the wrapper script executable

```
sudo chmod +x /home/mukbuddy/app/deploy/run-mukbuddy-api.sh
```

### Step 20. Prepare the supervisord config to send to Pair

Open this file:
```
nano /home/mukbuddy/app/deploy/pair-supervisord.conf.example
```

Replace each `<PLACEHOLDER>` like so:
- `<ACCOUNT_USERNAME>` → `mukbuddy`
- `<APP_DIR>` → `/home/mukbuddy/app`
- `<LOG_DIR>` → `/home/mukbuddy/logs` (create it: `sudo -u mukbuddy mkdir -p /home/mukbuddy/logs`)
- `<ENV_FILE>` → `/home/mukbuddy/app/backend/.env`

Save and exit.

### Step 21. Open a support ticket with Pair

Send them this message (with the file from Step 20 attached):

> Please add the attached supervisord program block (`mukbuddy-api`) to your supervisord config and reload supervisord. The wrapper script is at `/home/mukbuddy/app/deploy/run-mukbuddy-api.sh` and is already executable. The app must run as user `mukbuddy`, listen on `127.0.0.1:8001`, and load its environment from `/home/mukbuddy/app/backend/.env` (please use whatever your supervisord syntax expects to load that env file into the process). Thanks!

### Step 22. Wait for Pair to confirm

When Pair replies saying it's running, move to Part 7.

---

## PART 7 — Verify end-to-end

### Step 23. Confirm the backend is up

```
curl http://127.0.0.1:8001/api/health
```

Should return: `{"status":"healthy","time":"..."}`

If that fails, **STOP and report it** — Pair's setup didn't take.

### Step 24. Confirm Apache forwards to the backend

```
curl https://mukbuddy.com/api/health
```

Should return the same `{"status":"healthy",...}`. If you get a 502 Bad Gateway, the Apache proxy or the backend service is misconfigured.

### Step 25. Submit a test lead from the live site

Open `https://mukbuddy.com` in your browser. Fill out the contact form with real test data. Click Send.

You should:
- Land on `https://mukbuddy.com/thank-you?lead_id=...`
- See the "Got it. We'll be in touch." page

### Step 26. Verify the lead emailed Jed

Within 5–10 seconds, Jed should receive an email at `Jed@websitetalkingheads.com` with the test lead. Confirm with Jed.

### Step 27. Verify the lead landed in MySQL

```
mysql -u working_69_w -p working_mukbuddy -e "SELECT id, name, email, created_at FROM leads ORDER BY created_at DESC LIMIT 1;"
```

Should show your test lead.

### Step 28. If all three pass — DONE 🎉

Tell Jed it's live. Don't forget to delete any test leads from MySQL before announcing.

---

## Common issues

| Symptom | Fix |
|---|---|
| `502 Bad Gateway` on `/api/*` | Backend isn't running. Ask Pair to check supervisord status. |
| Browser shows site but form errors with CORS | The `CORS_ORIGINS` in `.env` doesn't exactly match the domain. Must be `https://mukbuddy.com,https://www.mukbuddy.com` |
| Lead saves but no email | Check `/home/mukbuddy/logs/mukbuddy-api.err.log` for "Lead email failed" — usually Resend API key wrong or domain not verified |
| `/thank-you` shows Apache 404 on refresh | Apache `mod_rewrite` not enabled. Run `sudo a2enmod rewrite && sudo systemctl reload apache2` |
| MySQL "Access denied" | Wrong password in `.env`, or user `working_69_w` doesn't have permission on `working_mukbuddy` |
