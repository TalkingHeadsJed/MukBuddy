import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import PageHead from "@/components/PageHead";
import { IMAGES } from "@/lib/images";
import { ORDER_URL } from "@/lib/constants";
import { appendAttribution } from "@/lib/attribution";

/* /about — Founder bio + E-E-A-T trust page. Includes Person and Organization
   schema markup so Google's Knowledge Graph can attribute the brand to a
   named human inventor. */

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const personSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mukbuddy.com/about#founder",
        name: "Jason Brouk",
        jobTitle: "Founder, Floor Lord Industries — Inventor of Muk Buddy",
        url: "https://mukbuddy.com/about",
        sameAs: ["https://thefloorlord.com/"],
        worksFor: { "@id": "https://mukbuddy.com/#organization" },
        knowsAbout: [
          "Wet/dry vacuum filtration",
          "Reusable shop vac bags",
          "Drywall dust control",
          "Concrete dust mitigation",
          "Commercial flooring",
          "Patent-pending 2-chamber filter design",
        ],
        description:
          "Inventor of the patent-pending Muk Buddy 2-chamber reusable wet/dry vac filter. 28+ years operating commercial floor and cleanup crews. Patent-pending status held by Floor Lord Industries.",
      },
      {
        "@type": "AboutPage",
        "@id": "https://mukbuddy.com/about#aboutpage",
        url: "https://mukbuddy.com/about",
        name: "About Muk Buddy — Inventor & Company",
        mainEntity: { "@id": "https://mukbuddy.com/about#founder" },
      },
    ],
  };

  return (
    <main data-testid="about-page" className="bg-cream text-ink overflow-x-hidden">
      <PageHead
        title="About Muk Buddy — Built by a Contractor for Contractors"
        description="The story behind the patent-pending Muk Buddy 2-chamber reusable shop vac bag. Built by Jason Brouk of Floor Lord Industries after 28+ years on jobsites. Made in the USA."
        canonical="https://mukbuddy.com/about"
        ogImage="https://mukbuddy.com/og-image-home.png"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <Header />

      <article className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <header className="mb-10">
          <p
            data-testid="about-eyebrow"
            className="font-bangers text-sm tracking-[0.2em] text-muk uppercase mb-3"
          >
            About Muk Buddy
          </p>
          <h1
            data-testid="about-headline"
            className="font-bowlby text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-ink"
          >
            Built by a contractor.{" "}
            <span className="hl-yellow">Tested by 800 jobs.</span>
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            Muk Buddy didn&rsquo;t come out of a product-design committee. It came
            out of a tired contractor staring at a $10 disposable shop vac bag
            that just ripped &mdash; for the third time that week &mdash;
            mid-drywall job, with a customer in the next room.
          </p>
        </header>

        <section
          data-testid="about-bio"
          className="space-y-6 text-base sm:text-lg text-ink/85 leading-relaxed"
        >
          <h2 className="font-bowlby text-2xl sm:text-3xl text-ink mt-10 mb-2">
            The founder &mdash; Jason Brouk
          </h2>

          <p>
            <strong>Jason Brouk</strong> is the founder of{" "}
            <a
              href="https://thefloorlord.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-muk decoration-2 underline-offset-2 hover:text-muk"
            >
              Floor Lord Industries
            </a>{" "}
            and the inventor of the Muk Buddy reusable 2-chamber wet/dry vac
            filter system. He&rsquo;s spent the last{" "}
            <strong>28 years</strong> running floors &mdash; commercial,
            residential, restoration, post-construction &mdash; and watching
            every working crew bleed the same money on the same disposable bags
            that fail the same way.
          </p>

          <p>
            Disposable shop vac bags are designed to be thrown out. They tear,
            they clog, they choke the filter when they fail, and they cost real
            money &mdash; <strong>roughly $200/month per crew</strong>, every
            month, forever. A 5-crew operation burns ~$12,000/year on
            disposables alone, not counting motor wear and the time a crew
            stands around changing them mid-job.
          </p>

          <p>
            After enough years of that, Jason built the thing he wished existed:
            a single reusable filter assembly with two chambers &mdash; one for
            heavy debris, one for fine dust &mdash; that{" "}
            <strong>separates the load from the airflow path</strong> so the
            filter stays clean, suction stays strong, and the motor doesn&rsquo;t
            cook trying to pull through a clogged bag.
          </p>

          <p>
            Floor Lord Industries has a{" "}
            <strong>patent pending</strong> on the 2-chamber design in the
            United States. The Muk Buddy assembly is{" "}
            <strong>designed and manufactured in the USA</strong>
            {" "}&mdash; not outsourced overseas like the disposable bags it
            replaces.
          </p>

          <h2 className="font-bowlby text-2xl sm:text-3xl text-ink mt-12 mb-2">
            Why we&rsquo;re different
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-ink/85">
            <li>
              <strong>Built by a working contractor</strong>, not a marketing
              team. Every spec is shaped by what kills you on a real jobsite.
            </li>
            <li>
              <strong>Patent-pending 2-chamber design.</strong> Real engineering
              IP, not a knockoff filter sock.
            </li>
            <li>
              <strong>Made in the USA.</strong> Designed, manufactured, and
              assembled stateside.
            </li>
            <li>
              <strong>One purchase, no recurring bag tax.</strong> Replaces
              hundreds of disposable bags over its service life.
            </li>
          </ul>

          <h2 className="font-bowlby text-2xl sm:text-3xl text-ink mt-12 mb-2">
            Who Muk Buddy is for
          </h2>

          <p>
            If you run a 12&ndash;20 gallon wet/dry shop vac for a living
            &mdash; drywall, concrete, demolition, restoration, auto detail,
            janitorial &mdash; this was built for you. If you push a vac around
            your garage on weekends, it&rsquo;ll work for you too. We just
            didn&rsquo;t build it with you in mind.
          </p>

          <p className="text-sm text-ink/60 italic mt-8">
            Have a fitment question or want crew pricing? Contact us through the
            form on the homepage. Replies inside one business day.
          </p>
        </section>

        <div className="mt-12 pt-10 border-t-4 border-ink">
          <a
            data-testid="about-cta"
            href={appendAttribution(ORDER_URL)}
            target="_blank"
            rel="noopener noreferrer"
            className="sticker-btn inline-flex items-center gap-2 bg-slime text-ink font-bangers text-2xl uppercase tracking-wider px-8 py-5 border-4 border-ink shadow-brutal rounded-sm"
          >
            See Muk Buddy &rarr;
          </a>
        </div>
      </article>

      <Footer />
    </main>
  );
}
