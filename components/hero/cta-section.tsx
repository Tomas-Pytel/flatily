import Link from "next/link";
import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-4xl mx-auto rounded-3xl bg-linear-to-br from-[#004aad] via-blue-600 to-[#5de0e6] p-12 text-center text-white shadow-2xl">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Pripravení začať so správou nehnuteľností?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Pridajte sa k stovkám spokojných prenajímateľov, ktorí už
            zautomatizovali svoj workflow.
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              asChild
            >
              <Link href="/auth/sign-up">Vytvoriť bezplatný účet</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
