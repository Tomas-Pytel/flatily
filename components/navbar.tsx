import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "./env-var-warning";
import { Suspense } from "react";
import { AuthButton } from "./auth-button";
import Link from "next/link";
import Image from "next/image";
import Logo from "../app/favicon.ico";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/**Logo section */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image src={Logo} alt="Rentio Logo" width={32} height={32} />
          <span className="text-xl font-bold">Rentio</span>
        </Link>

        {/**Auth section */}
        <div className="hidden md:flex items-center gap-4">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense
              fallback={
                <div className="w-20 h-8 bg-muted animate-pulse rounded-md" />
              }
            >
              <AuthButton />
            </Suspense>
          )}
        </div>
      </div>
    </header>
  );
}
