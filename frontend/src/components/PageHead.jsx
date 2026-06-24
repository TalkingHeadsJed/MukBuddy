import { Helmet } from "react-helmet-async";

/**
 * Per-route <head> manager. Wraps react-helmet-async so each page can
 * declare its own title / description / canonical / OG tags. Prerender
 * (scripts/prerender.js) captures these into the static HTML, and React
 * keeps them in sync on client-side navigation.
 *
 * Pass only the props you want to override per route — anything you skip
 * falls back to what's already in public/index.html.
 */
export default function PageHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  robots,
  preloadImage,
  productPrice,
  productCurrency = "USD",
}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {title && <meta property="og:title" content={title} />}
      {title && <meta name="twitter:title" content={title} />}

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}

      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Product price metadata (Open Graph product extension). Helps
          Google/Bing/Pinterest surface price + currency in rich results. */}
      {productPrice && <meta property="product:price:amount" content={productPrice} />}
      {productPrice && <meta property="product:price:currency" content={productCurrency} />}
      {productPrice && <meta property="og:price:amount" content={productPrice} />}
      {productPrice && <meta property="og:price:currency" content={productCurrency} />}

      {/* Preload the page's LCP image (above-the-fold hero) so it starts
          downloading in parallel with the JS bundle. Major mobile LCP win. */}
      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={preloadImage}
          fetchPriority="high"
        />
      )}

      <meta property="og:type" content={ogType} />

      {robots && <meta name="robots" content={robots} />}
    </Helmet>
  );
}
