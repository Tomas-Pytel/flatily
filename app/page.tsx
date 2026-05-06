import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero/hero";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import Logo from "./favicon.ico";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-16 items-center">
        {/**NAVBAR */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/" className="flex items-center gap-2">
                <Image src={Logo} alt="Rentio Logo" width={32} height={32} />
                <span className="text-xl">Rentio</span>
              </Link>
            </div>
            <div className="hidden md:block">
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>
        {/**THE HERO SECTION */}
        <Hero />

        {/**FOOTER */}
        <Footer />
      </div>
    </main>
  );
}
