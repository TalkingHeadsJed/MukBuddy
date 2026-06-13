export const ORDER_URL = "https://thefloorlord.com/product/muk-buddy/";

// WooCommerce direct-add-to-cart (used by /ads landing page for 1-click checkout).
// Pattern confirmed working on thefloorlord.com:
//   /checkout/?add-to-cart=ID&quantity=N
// Going straight to /checkout/ skips the cart page entirely.
export const WC_CHECKOUT_URL = "https://thefloorlord.com/checkout/";
export const WC_PRODUCT_ID = "6541"; // Muk Buddy product ID

/**
 * Build a WooCommerce add-to-cart URL targeting the checkout page directly.
 * Optionally append captured UTM/tracking params so Meta-ads attribution
 * flows through to WooCommerce reports.
 * @param {number} quantity defaults to 1
 * @param {string} utmSuffix already-encoded "utm_source=...&utm_medium=..." string
 */
export function buildAddToCartUrl(quantity = 1, utmSuffix = "") {
  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const base = `${WC_CHECKOUT_URL}?add-to-cart=${WC_PRODUCT_ID}&quantity=${qty}`;
  return utmSuffix ? `${base}&${utmSuffix}` : base;
}

export const VIMEO_EMBED =
  "https://player.vimeo.com/video/1183206006?h=8f6358ab2b&title=0&byline=0&portrait=0";
export const VIMEO_EMBED_SEEITRUN =
  "https://player.vimeo.com/video/1192068620?h=5d9f57e533&title=0&byline=0&portrait=0";
// Short clip used on the /ads Meta-traffic landing page hero
export const VIMEO_EMBED_ADS_HERO =
  "https://player.vimeo.com/video/1194871458?h=fe6c043d1c&title=0&byline=0&portrait=0";
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
