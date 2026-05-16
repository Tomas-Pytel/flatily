import { Hero } from "@/components/hero/hero";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import FunctionsSection from "@/components/hero/functions-section";
import CTASection from "@/components/hero/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/**NAVBAR */}
      <Navbar />

      {/**THE HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 md:py-24">
        <Hero />
        <FunctionsSection />
        <CTASection />
      </main>

      {/**FOOTER */}
      <Footer />
    </div>
  );
}
