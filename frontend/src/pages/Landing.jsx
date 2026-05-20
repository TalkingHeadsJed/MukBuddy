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
import BlogStrip from "@/components/sections/BlogStrip";
import BleedTicker from "@/components/sections/BleedTicker";

export default function Landing() {
  return (
    <main data-testid="landing-page" className="bg-cream text-ink overflow-x-hidden">
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
