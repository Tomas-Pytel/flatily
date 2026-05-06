import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "./env-var-warning";
import { Suspense } from "react";
import { AuthButton } from "./auth-button";
import Link from "next/link";
import Image from "next/image";
import Logo from "../app/favicon.ico";

export default function Navbar() {
  return (
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
  );
}
