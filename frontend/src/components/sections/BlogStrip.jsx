import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * "Latest from the Field" strip — fetches build/blog/posts.json (the 3 newest
 * posts manifest emitted by scripts/build-blog.js) and renders them as a
 * branded card grid. Hidden entirely if no posts (graceful, no layout shift).
 */
export default function BlogStrip() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/blog/posts.json", { credentials: "omit" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  if (!posts.length) return null;

  return (
    <section
      data-testid="blog-strip-section"
      className="relative py-16 sm:py-20 bg-ink text-cream border-y-4 border-slime overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[3px] bg-slime" />
          <span className="font-bangers text-lg sm:text-xl uppercase tracking-[0.25em] text-slime">
            From the Field
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 mt-3">
          <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl text-cream leading-[1.0] max-w-3xl">
            Hands-on guides for{" "}
            <span className="text-slime">contractors</span> who actually use
            their vacs.
          </h2>
          <a
            href="/blog"
            data-testid="blog-strip-all"
            className="font-bangers text-sm sm:text-base uppercase tracking-[0.25em] text-slime border-b-2 border-slime hover:text-cream hover:border-cream transition-colors"
          >
            All posts →
          </a>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <a
              key={p.slug}
              href={`/blog/${p.slug}`}
              data-testid={`blog-strip-card-${i}`}
              className="group block bg-cream text-ink border-4 border-cream hover:border-slime transition-colors overflow-hidden"
            >
              {p.hero_image ? (
                <div
                  className="h-44 bg-center bg-cover border-b-4 border-ink"
                  style={{ backgroundImage: `url('${p.hero_image}')` }}
                  aria-hidden="true"
                />
              ) : (
                <div className="h-44 bg-cream-100 border-b-4 border-ink flex items-center justify-center">
                  <span className="font-bangers text-3xl text-muk opacity-30">
                    MUK BUDDY
                  </span>
                </div>
              )}
              <div className="p-5">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muk">
                  {new Date(p.publish_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <h3 className="mt-2 font-anton text-xl sm:text-2xl text-ink leading-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-ink/70 leading-snug line-clamp-3">
                  {p.excerpt}
                </p>
                <div className="mt-4 font-bangers text-sm tracking-wider uppercase text-muk group-hover:text-ink inline-flex items-center gap-1">
                  Read it
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
