"""Static HTML verification of the prerendered Muk Buddy site against the SEO/EEAT spec."""
import html as htmllib
import json
import os
import re
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://two-chamber-test.preview.emergentagent.com").rstrip("/")


def fetch(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=30)
    return r.status_code, r.text


# --- Homepage ---

def test_home_200_and_h1():
    code, html = fetch("/")
    assert code == 200
    # The h1 wraps part of its text in a <span> (highlight), so match on the h1's
    # text content with inner tags stripped, not on raw HTML between the tags.
    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
    assert len(h1s) == 1, f"expected exactly 1 <h1>, found {len(h1s)}"
    h1_text = re.sub(r"\s+", " ", htmllib.unescape(re.sub(r"<[^>]+>", " ", h1s[0]))).strip()
    assert "shop vac bag" in h1_text.lower(), f"h1 must contain 'Shop Vac Bag', got '{h1_text}'"


def test_home_subhead_has_keywords():
    _, html = fetch("/")
    # subhead phrases
    for needle in ["16", "20 gallon", "HEPA", "shop vac dust bag"]:
        assert needle.lower() in html.lower(), f"missing '{needle}' on homepage"


def test_home_shows_99():
    _, html = fetch("/")
    assert "$99" in html, "expected $99 visible on homepage near CTA"


def test_home_title_tag_exact():
    _, html = fetch("/")
    m = re.search(r"<title>([^<]+)</title>", html)
    assert m, "no <title>"
    # <title> content is HTML-encoded in the page source (& is served as &amp;),
    # so decode entities before comparing to the human-readable title.
    title = htmllib.unescape(m.group(1)).strip()
    expected = "Reusable Shop Vac Bags & Filter Bags, 16\u201320 Gal | Muk Buddy"
    assert title == expected, f"title mismatch: got '{title}'"


def test_home_product_price_meta():
    _, html = fetch("/")
    assert re.search(r'<meta\s+property=["\']product:price:amount["\']\s+content=["\']99\.00["\']', html), \
        "missing product:price:amount meta with 99.00"


def _jsonld_top_level_entities(html):
    """Top-level JSON-LD entities: each script's root object(s) plus any @graph members."""
    entities = []
    for block in re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.I | re.S):
        data = json.loads(block)
        for obj in (data if isinstance(data, list) else [data]):
            entities.extend(obj.get("@graph", [obj]))
    return entities


def test_home_jsonld_single_product():
    _, html = fetch("/")
    # Count top-level Product entities only. The product's isAccessoryOrSparePartFor
    # legitimately nests a generic {"@type": "Product", "name": "Wet/Dry Vacuum"}
    # describing compatible vacs; that is a property value, not a second product.
    products = [e for e in _jsonld_top_level_entities(html) if e.get("@type") == "Product"]
    assert len(products) == 1, f"expected exactly 1 top-level Product JSON-LD entity, found {len(products)}"
    product = products[0]
    assert product.get("mpn") == "MUKBUD1420", "Product mpn must be MUKBUD1420"
    offers = product.get("offers")
    offers = offers if isinstance(offers, list) else [offers]
    assert any(o and o.get("price") == "99.00" and o.get("priceCurrency") == "USD" for o in offers), \
        "Product must have an Offer at 99.00 USD"
    for nested in (product.get("isAccessoryOrSparePartFor") or []):
        if isinstance(nested, dict):
            assert "offers" not in nested, "nested compatible-vac Product must not carry offers"
    assert "MUKBUD1420" in html, "missing mpn MUKBUD1420"
    assert '"price":"99.00"' in html or '"price": "99.00"' in html, "missing price 99.00"
    assert "USD" in html
    assert "hasMerchantReturnPolicy" not in html, "should NOT have hasMerchantReturnPolicy"
    assert "Patent-Pending 2-Chamber" in html, "additionalProperty should mention Patent-Pending 2-Chamber"


# --- PATENT PENDING (case sensitive matters for visible UI) ---

def test_home_hero_ribbon_patent_pending():
    _, html = fetch("/")
    assert "PATENT PENDING" in html, "Hero ribbon must say PATENT PENDING"
    assert "PATENT PEND. 2-CHAMBER" in html or "PATENT PEND" in html, "trust badge must say PATENT PEND."


def _no_patented(path):
    _, html = fetch(path)
    # Strip the literal phrase 'patent pending' first to avoid false positives on 'patent'
    cleaned = re.sub(r"patent[-\s]pending", "", html, flags=re.I)
    cleaned = re.sub(r"patent[-\s]pend\.?", "", cleaned, flags=re.I)
    # forbidden tokens
    forbidden = [
        r"\bUS Patented\b",
        r"\bPatented\b",
        r"\bpatent holder\b",
        r"\bUS patent\b",
    ]
    hits = []
    for pat in forbidden:
        for m in re.finditer(pat, cleaned, re.I):
            hits.append((pat, m.group(0)))
    assert not hits, f"forbidden patent terms in {path}: {hits}"


def test_no_patented_on_home():
    _no_patented("/")


def test_no_patented_on_ads():
    _no_patented("/ads")


def test_no_patented_on_about():
    _no_patented("/about")


def test_home_contains_patent_pending():
    _, html = fetch("/")
    assert re.search(r"patent[-\s]pending", html, re.I), "homepage must include 'patent pending'"


# --- /ads ---

def test_ads_200():
    code, html = fetch("/ads")
    assert code == 200


def test_ads_noindex_meta():
    _, html = fetch("/ads")
    assert re.search(r'<meta\s+name=["\']robots["\']\s+content=["\']noindex,\s*follow["\']', html), \
        "missing <meta name='robots' content='noindex, follow'> on /ads"


def test_ads_trust_strip_pills():
    _, html = fetch("/ads")
    for needle in ["Made in the USA", "Built for daily", "Secure checkout"]:
        assert needle.lower() in html.lower(), f"missing trust pill phrase '{needle}' on /ads"
    # Patent-pending pill (not US Patented)
    assert re.search(r"patent[-\s]pending\s+design", html, re.I), "expected 'Patent-Pending design' pill"


def test_ads_guarantee_bar_no_returns_or_shipping():
    _, html = fetch("/ads")
    # No 30-day return / Free shipping in GuaranteeBar — search whole page
    assert not re.search(r"30[-\s]?day\s+return", html, re.I), "found '30-day return' on /ads"
    assert not re.search(r"free\s+shipping", html, re.I), "found 'Free shipping' on /ads"


# --- /about ---

def test_about_200_and_h1():
    code, html = fetch("/about")
    assert code == 200
    assert "Built by a contractor" in html, "missing about h1 'Built by a contractor.'"
    assert "Tested by 800 jobs" in html, "missing 'Tested by 800 jobs' in h1"
    assert "Jason Brouk" in html, "founder name Jason Brouk missing"
    assert re.search(r"patent[-\s]pending", html, re.I), "about must say 'patent pending'"


# --- Blog video embeds ---

BLOG_VIDEO_MAP = {
    "/blog/10-reasons-reusable-shop-vac-bag/": "jK-Ocvafh24",
    "/blog/why-shop-vac-clogs-on-drywall-dust/": "qR-Ow0woAmw",
    # Swapped from HwfeHKGOzQM in a1cf296 (2026-07-01); "Your Shop Vac Shouldn't Get Weaker as You Work".
    "/blog/shop-vac-lost-suction-how-to-fix/": "POKKMf2BD4Y",
    "/blog/why-disposable-shop-vac-bags-fail/": "KkaqjZcYN0s",
    # Deliberately still Ks0oA7Pnogc ("Every Time Your Crew Stops for the Vac, You're
    # Losing Money"). a1cf296 swapped the live post to QUa8FHTqgws, which is the drywall-dust
    # clip -- looks like a mis-pick. Pending Jed's call; update here only if that swap was intended.
    "/blog/shop-vac-downtime-costing-your-crew/": "Ks0oA7Pnogc",
    "/blog/disposable-vs-reusable-shop-vac-bags/": "8wKa1mR66gk",
}


def test_blog_videos_embedded():
    failures = []
    for path, yt_id in BLOG_VIDEO_MAP.items():
        code, html = fetch(path)
        if code != 200:
            failures.append((path, f"HTTP {code}"))
            continue
        if not re.search(r"<iframe[^>]+src=[\"'][^\"']*youtube[^\"']*[\"']", html, re.I):
            failures.append((path, "no youtube iframe"))
            continue
        if yt_id not in html:
            failures.append((path, f"missing YT id {yt_id}"))
    assert not failures, f"blog video embed failures: {failures}"


def test_blog_no_bag_post_video():
    # This post had no video when the test was written; a1cf296 (2026-07-01) added
    # HfsaV45oXJ4 ("Not Using a Wet/Dry Vac Bag is clogging your filter"). Pin that exact clip.
    code, html = fetch("/blog/running-shop-vac-without-bag-cost/")
    assert code == 200
    srcs = re.findall(r"<iframe[^>]+src=[\"']([^\"']*youtube[^\"']*)[\"']", html, re.I)
    assert len(srcs) == 1, f"expected exactly 1 youtube iframe, found {len(srcs)}"
    assert "HfsaV45oXJ4" in srcs[0], f"wrong video embedded: {srcs[0]}"


def test_blog_author_bio_text():
    # check on any post
    _, html = fetch("/blog/10-reasons-reusable-shop-vac-bag/")
    expected = "Founder of Floor Lord Industries and inventor of Muk Buddy. 28 years doing floors \u2014 and still building the tools contractors wish already existed."
    # Tolerate either em-dash or hyphen
    expected_alt = expected.replace("\u2014", "—")
    assert expected in html or expected_alt in html, "author bio text mismatch — check exact wording with 'and still'"


# --- llms.txt ---

def test_llms_txt_present():
    code, text = fetch("/llms.txt")
    assert code == 200, f"/llms.txt status {code}"
    # First non-empty line should be a heading containing Muk Buddy
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    assert lines, "llms.txt empty"
    first = lines[0]
    assert first.startswith("#") and "muk buddy" in first.lower(), f"first heading: '{first}'"
    low = text.lower()
    assert "16-20 gallon" in low or "16\u201320 gallon" in low, "llms.txt missing '16-20 gallon'"
    assert "made in the usa" in low, "llms.txt missing 'Made in the USA'"
    assert "patent pending" in low, "llms.txt missing 'patent pending'"
