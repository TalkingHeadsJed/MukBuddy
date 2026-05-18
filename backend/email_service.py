"""
Resend-backed lead notification email.

Design rules:
  • Never block the parent request. If Resend fails, the lead is already saved.
  • Sync SDK is run inside asyncio.to_thread so the FastAPI loop stays free.
  • Recipient and sender are env-driven so they can change with zero code edits.
"""
import asyncio
import html
import logging
import os
from datetime import datetime
from typing import Optional

import resend


logger = logging.getLogger("mukbuddy.email")

_API_KEY = os.environ.get("RESEND_API_KEY")
LEAD_NOTIFY_FROM = os.environ.get("LEAD_NOTIFY_FROM", "Muk Buddy <noreply@mukbuddy.com>")
LEAD_NOTIFY_TO = os.environ.get("LEAD_NOTIFY_TO", "")

if _API_KEY:
    resend.api_key = _API_KEY


def _safe(v: Optional[str]) -> str:
    return html.escape(v or "—")


def _build_html(
    *,
    name: str,
    email: str,
    phone: Optional[str],
    crew_size: Optional[str],
    message: str,
    ip: Optional[str],
    user_agent: Optional[str],
    created_at: datetime,
) -> str:
    return f"""\
<!doctype html>
<html><body style="margin:0;padding:0;background:#FFF4D6;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1A0625;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="padding:24px 12px;background:#FFF4D6;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;border:4px solid #1A0625;">
        <tr>
          <td style="background:#39FF14;padding:16px 24px;border-bottom:4px solid #1A0625;">
            <div style="font-size:13px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;">★ New Muk Buddy Lead ★</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <h1 style="margin:0 0 16px 0;font-size:28px;line-height:1.1;color:#1A0625;">{_safe(name)}</h1>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.5;">
              <tr><td style="padding:6px 0;color:#5A4A72;width:120px;">Email</td>
                  <td style="padding:6px 0;"><a href="mailto:{_safe(email)}" style="color:#7A6FE0;">{_safe(email)}</a></td></tr>
              <tr><td style="padding:6px 0;color:#5A4A72;">Phone</td>
                  <td style="padding:6px 0;">{_safe(phone)}</td></tr>
              <tr><td style="padding:6px 0;color:#5A4A72;">Crew Size</td>
                  <td style="padding:6px 0;">{_safe(crew_size)}</td></tr>
              <tr><td style="padding:6px 0;color:#5A4A72;vertical-align:top;">Message</td>
                  <td style="padding:6px 0;white-space:pre-wrap;">{_safe(message)}</td></tr>
            </table>

            <div style="margin-top:20px;padding:12px;background:#FFF9E8;border-left:4px solid #7A6FE0;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#5A4A72;">
              // Submitted: {created_at.isoformat()}<br/>
              // IP: {_safe(ip)}<br/>
              // UA: {_safe((user_agent or "")[:200])}
            </div>

            <div style="margin-top:24px;text-align:center;">
              <a href="mailto:{_safe(email)}?subject=Re:%20Muk%20Buddy%20inquiry"
                 style="display:inline-block;background:#39FF14;color:#1A0625;font-weight:700;text-decoration:none;padding:12px 28px;border:3px solid #1A0625;letter-spacing:0.1em;text-transform:uppercase;">
                Reply to {_safe(name)}
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 24px;background:#1A0625;color:#FFF4D6;font-size:11px;text-align:center;">
            Muk Buddy — Lead Notifications
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


def _build_text(
    *, name, email, phone, crew_size, message, ip, user_agent, created_at
) -> str:
    return (
        f"NEW MUK BUDDY LEAD\n"
        f"==================\n\n"
        f"Name:      {name}\n"
        f"Email:     {email}\n"
        f"Phone:     {phone or '-'}\n"
        f"Crew:      {crew_size or '-'}\n\n"
        f"Message:\n{message}\n\n"
        f"---\n"
        f"Submitted: {created_at.isoformat()}\n"
        f"IP:        {ip or '-'}\n"
        f"UA:        {(user_agent or '')[:200]}\n"
    )


async def send_lead_notification(
    *,
    name: str,
    email: str,
    phone: Optional[str],
    crew_size: Optional[str],
    message: str,
    ip: Optional[str],
    user_agent: Optional[str],
    created_at: datetime,
) -> bool:
    """Fire-and-log email. Returns True on success, False otherwise.

    Never raises — the caller's request must complete regardless.
    """
    if not _API_KEY or not LEAD_NOTIFY_TO:
        logger.info(
            "Email skipped: RESEND_API_KEY=%s, LEAD_NOTIFY_TO=%s",
            bool(_API_KEY),
            bool(LEAD_NOTIFY_TO),
        )
        return False

    recipients = [r.strip() for r in LEAD_NOTIFY_TO.split(",") if r.strip()]
    params = {
        "from": LEAD_NOTIFY_FROM,
        "to": recipients,
        "reply_to": email,
        "subject": f"New Muk Buddy lead — {name}",
        "html": _build_html(
            name=name, email=email, phone=phone, crew_size=crew_size,
            message=message, ip=ip, user_agent=user_agent, created_at=created_at,
        ),
        "text": _build_text(
            name=name, email=email, phone=phone, crew_size=crew_size,
            message=message, ip=ip, user_agent=user_agent, created_at=created_at,
        ),
    }

    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        eid = result.get("id") if isinstance(result, dict) else None
        logger.info("Lead email sent. resend_id=%s to=%s", eid, recipients)
        return True
    except Exception as exc:
        logger.exception("Lead email failed (lead is saved): %s", exc)
        return False
