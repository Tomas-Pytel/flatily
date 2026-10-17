import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Nehnuteľnosť sa nenašla</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Požadovaný byt neexistuje alebo k nemu nemáte prístup.
        </p>
        <Button asChild className="mt-6">
          <Link href="/properties">Späť na nehnuteľnosti</Link>
        </Button>
      </div>
    </main>
  );
}
