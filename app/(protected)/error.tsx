"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProtectedError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-full items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Nastala chyba</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stránku sa nepodarilo načítať. Skúste to znova alebo sa vráťte na
          prehľad.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>Skúsiť znova</Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Prehľad</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
