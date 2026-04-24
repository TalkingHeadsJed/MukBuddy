import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Airflow from "@/components/sections/Airflow";
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

export default function Landing() {
  return (
    <main data-testid="landing-page" className="bg-cream text-ink overflow-x-hidden">
      <Header />
      <Hero />
      <Problem />
      <Airflow />
      <Difference />
      <TwoChamber />
      <Performance />
      <Benefits />
      <Money />
      <WasteScale />
      <Proof />
      <Objections />
      <FAQ />
      <LeadForm />
      <FinalCTA />
      <Footer />
    </main>
  );
}
