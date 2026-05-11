import { Hero } from "@/components/hero/hero";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/**NAVBAR */}
      <Navbar />

      {/**THE HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 md:py-24">
        <Hero />
      </main>

      {/**FOOTER */}
      <Footer />
    </div>
  );
}
