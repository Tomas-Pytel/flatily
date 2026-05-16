import { Button } from "../ui/button";
import Image from "next/image";
import { Banknote, Wrench, FileText } from "lucide-react";
import { InfoCard } from "./info-card";
import Link from "next/link";
import { InformationCard } from "@/types/hero";

export function Hero() {
  const infoCards: InformationCard[] = [
    {
      title: "Automatizované financie",
      description: "Prehľad platieb, nájomného a výdavkov v reálnom čase",
      icon: <Banknote className="size-6 text-blue-500" />,
    },
    {
      title: "Inteligentná údržba",
      description:
        "AI predikcia opráv, ktorá odhalí technické problémy skôr, než sa stanú drahými.",
      icon: <Wrench className="size-6 text-blue-500" />,
    },
    {
      title: "Legislatívny súlad",
      description:
        "Automatická generácia zmlúv a aktualizácie podľa platnej slovenskej legislatívy.",
      icon: <FileText className="size-6 text-blue-500" />,
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl gap-20 items-center px-4 sm:px-6 lg:px-8">
      {/**Top section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Stabilita a rast pre{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-blue-700">
              moderných prenajímateľov.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg">
            Zefektívnite správu svojich nehnuteľností, automatizujte platby a
            spravujte nájomníkov na jednom mieste pomocou našej komplexnej
            platformy.
          </p>

          <Button size="lg" asChild variant="default" className="mt-4">
            <Link href="/dashboard">Začať teraz</Link>
          </Button>
        </div>

        {/**Image wrapper */}
        <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-border/50">
          <Image
            src="/hero-img.jpg"
            alt="Správa nehnuteľností"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>
      </section>

      {/**Bottom section */}
      <section className="flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Kompletný ekosystém pre správu majetku
          </h2>
          <p className="text-muted-foreground text-lg">
            Precízne navrhnuté nástroje na automatizáciu vášho workflowu a
            ochranu vašich investícií.
          </p>
        </div>

        {/**Information cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 w-full">
          {infoCards.map((card, index) => (
            <InfoCard key={index} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
