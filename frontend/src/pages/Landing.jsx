import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import BagsVsMukBuddy from "@/components/sections/BagsVsMukBuddy";
import Problem from "@/components/sections/Problem";
import Difference from "@/components/sections/Difference";
import TwoChamber from "@/components/sections/TwoChamber";
import Performance from "@/components/sections/Performance";
import Benefits from "@/components/sections/Benefits";
import Money from "@/components/sections/Money";
import WasteScale from "@/components/sections/WasteScale";
import Proof from "@/components/sections/Proof";
import Objections from "@/components/sections/Objections";
import FAQ from "@/components/sections/FAQ";
import LeadForm from "@/components/sections/LeadForm";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import MoneyReminder from "@/components/sections/MoneyReminder";
import BleedTicker from "@/components/sections/BleedTicker";
import BlogStrip from "@/components/sections/BlogStrip";
import PageHead from "@/components/PageHead";

export default function Landing() {
  return (
    <main data-testid="landing-page" className="bg-cream text-ink overflow-x-hidden">
      <PageHead
        title="Reusable Shop Vac Bags & Filter Bags, 12–20 Gal | Muk Buddy"
        description="The patent-pending Muk Buddy 2-chamber reusable shop vac bag replaces disposable bags in Ridgid, Shop-Vac, DeWalt, Craftsman and Stanley wet/dry vacs. High-efficiency dust filtration, captures fine drywall and concrete dust, $99 — saves crews thousands per year."
        canonical="https://mukbuddy.com/"
        ogImage="https://mukbuddy.com/og-image-home.png"
        productPrice="99.00"
        preloadImage="/img/hero-composite.png"
      />
      <Header />
      <Hero />
      <BagsVsMukBuddy />
      <Problem />
      <Money />
      <TwoChamber />
      <Difference />
      <Performance />
      <Benefits />
      <WasteScale />
      <Proof />
      <Objections />
      <MoneyReminder />
      <FAQ />
      <LeadForm />
      <FinalCTA />
      <BlogStrip />
      <Footer />
      <BleedTicker />
    </main>
  );
}
