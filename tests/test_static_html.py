"""Static HTML verification of the prerendered Muk Buddy site against the SEO/EEAT spec."""
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
    assert re.search(r"<h1[^>]*>[^<]*Shop Vac Bag[^<]*</h1>", html, re.I), "h1 must contain 'Shop Vac Bag'"


def test_home_subhead_has_keywords():
    _, html = fetch("/")
    # subhead phrases
    for needle in ["12", "20 gallon", "HEPA", "shop vac dust bag"]:
        assert needle.lower() in html.lower(), f"missing '{needle}' on homepage"


def test_home_shows_99():
    _, html = fetch("/")
    assert "$99" in html, "expected $99 visible on homepage near CTA"


def test_home_title_tag_exact():
    _, html = fetch("/")
    m = re.search(r"<title>([^<]+)</title>", html)
    assert m, "no <title>"
    title = m.group(1).strip()
    expected = "Reusable Shop Vac Bags & Filter Bags, 12\u201320 Gal | Muk Buddy"
    assert title == expected, f"title mismatch: got '{title}'"


def test_home_product_price_meta():
    _, html = fetch("/")
    assert re.search(r'<meta\s+property=["\']product:price:amount["\']\s+content=["\']99\.00["\']', html), \
        "missing product:price:amount meta with 99.00"


def test_home_jsonld_single_product():
    _, html = fetch("/")
    # find all Product JSON-LD scripts
    products = re.findall(r'"@type"\s*:\s*"Product"', html)
    assert len(products) == 1, f"expected exactly 1 Product JSON-LD entity, found {len(products)}"
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
    "/blog/shop-vac-lost-suction-how-to-fix/": "HwfeHKGOzQM",
    "/blog/why-disposable-shop-vac-bags-fail/": "KkaqjZcYN0s",
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


def test_blog_no_bag_post_has_no_video():
    code, html = fetch("/blog/running-shop-vac-without-bag-cost/")
    assert code == 200
    assert not re.search(r"<iframe[^>]+youtube", html, re.I), "this post should NOT have a youtube iframe"


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
    assert "12-20 gallon" in low or "12\u201320 gallon" in low, "llms.txt missing '12-20 gallon'"
    assert "made in the usa" in low, "llms.txt missing 'Made in the USA'"
    assert "patent pending" in low, "llms.txt missing 'patent pending'"
