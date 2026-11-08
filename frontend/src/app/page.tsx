import Capabilities from "@/components/landing/Capabilities";
import ChecksSection from "@/components/landing/ChecksSection";
import Hero from "@/components/landing/Hero";
import Pricing from "@/components/landing/Pricing";
import SiteFooter from "@/components/landing/SiteFooter";
import SiteHeader from "@/components/landing/SiteHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <main>
        <Hero />
        <Capabilities />
        <ChecksSection />
        <Pricing />
      </main>
      <SiteFooter />
    </div>
  );
}