// Attribution capture + persistence for Google Ads / Meta Ads / Bing Ads tracking.
//
// The Order CTAs on mukbuddy.com link out to thefloorlord.com (separate domain
// running WooCommerce). When a paid-click visitor lands on /ads or / from an
// ad, the URL contains a click ID (gclid for Google Ads, gbraid/wbraid for
// iOS / app-tracked Google clicks, fbclid for Meta, msclkid for Bing). If we
// don't carry that click ID to thefloorlord.com on the outbound checkout link,
// the eventual purchase conversion on thefloorlord.com's WooCommerce thank-you
// page has nothing to attribute the sale to — Google Ads reports show "0 purchases."
//
// This module:
//   1. On every page load (call captureFromURL()), reads gclid/gbraid/wbraid/
//      utm_* / fbclid / msclkid from the URL and stashes them in localStorage
//      with a 90-day TTL.
//   2. appendAttribution(url) appends the stored params to an outbound URL so
//      every link from mukbuddy.com → thefloorlord.com carries the attribution
//      forward. The Floor Lord's Google tag then writes _gcl_aw, and the
//      existing purchase conversion attributes the eventual sale.
//
// Reference: https://support.google.com/google-ads/answer/9744275

import { useEffect, useState } from "react";

const STORAGE_KEY = "mb_attribution_v1";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

// Order is significant — first matched click ID wins. gclid > gbraid > wbraid.
const TRACKED_KEYS = [
  // Google Ads click IDs
  "gclid",
  "gbraid",
  "wbraid",
  // Meta (Facebook/Instagram) click ID
  "fbclid",
  // Microsoft Ads click ID
  "msclkid",
  // TikTok click ID
  "ttclid",
  // Standard UTM grid
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  // Google Analytics 4 referral / session
  "gad_source",
  "gad_campaignid",
];

/**
 * Read tracked params off window.location and persist them to localStorage.
 * Call once on app mount. Safe to call on every route change — only writes
 * when new params are present, so re-clicks on plain mukbuddy.com don't
 * overwrite the original attribution.
 *
 * Stores `_ts` (capture timestamp) so we can expire stale attribution.
 */
export function captureFromURL() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const existing = readStored() || {};
    let touched = false;
    for (const key of TRACKED_KEYS) {
      const v = params.get(key);
      if (v && v !== existing[key]) {
        existing[key] = v;
        touched = true;
      }
    }
    if (touched) {
      existing._ts = Date.now();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (e) {
    /* localStorage disabled — ignore silently */
  }
}

function readStored() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data._ts && Date.now() - data._ts > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Get the stored attribution as a URL-encoded query string (no leading ?).
 * Returns "" if nothing is stored. Used by appendAttribution() below.
 */
export function getAttributionQuery() {
  const data = readStored();
  if (!data) return "";
  const params = new URLSearchParams();
  for (const key of TRACKED_KEYS) {
    if (data[key]) params.set(key, data[key]);
  }
  return params.toString();
}

/**
 * Append stored attribution params to an outbound URL. Correctly handles
 * URLs that already have a query string.
 *
 *   appendAttribution("https://thefloorlord.com/my-cart/?add-to-cart=6541")
 *     → "https://thefloorlord.com/my-cart/?add-to-cart=6541&gclid=ABC&utm_source=google"
 */
export function appendAttribution(url) {
  if (!url) return url;
  const qs = getAttributionQuery();
  if (!qs) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}${qs}`;
}

/**
 * React hook: returns the URL with attribution params appended. Reads
 * localStorage on mount (after hydration) so SSR/prerendered output has
 * the bare URL (correct for crawlers — they don't have click IDs anyway).
 *
 * Usage:
 *   const orderHref = useAttributedHref(ORDER_URL);
 *   <a href={orderHref}>Order Muk Buddy →</a>
 *
 * Belt-and-suspenders: pair with onClick that re-computes to catch the
 * edge case where the user lands, browses for hours, and the attribution
 * was set in the meantime in another tab.
 */
export function useAttributedHref(url) {
  const [href, setHref] = useState(url);
  useEffect(() => {
    // Re-capture in case the user navigated to this route with fresh URL params
    captureFromURL();
    setHref(appendAttribution(url));
  }, [url]);
  return href;
}
