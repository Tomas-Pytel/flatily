import { Button } from "../ui/button";
import Image from "next/image";
import { Banknote, Wrench, FileText } from "lucide-react";
import { InfoCard } from "./info-card";
import Link from "next/link";
import { InformationCard } from "@/types/hero";

export function Hero() {
  const infoCards: InformationCard[] = [
    {
      title: "Automated Financials",
      description:
        "Real-time rent collection, expense tracking, and instant owner disbursements via encrypted ledger.",
      icon: <Banknote className="size-6 text-primary" />,
    },
    {
      title: "Smart Maintenance",
      description:
        "Predictive AI identifying repair needs before they become costly emergencies for your properties.",
      icon: <Wrench className="size-6 text-primary" />,
    },
    {
      title: "Compliance Engine",
      description:
        "Stay updated with local regulations and automated lease generation backed by legal frameworks.",
      icon: <FileText className="size-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl gap-20 items-center px-4 sm:px-6 lg:px-8">
      {/**Top section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Institutional Stability for Modern Property Owners.
          </h1>
          <p className="text-lg text-muted-foreground max-w-150">
            Streamline your rentals, automate payments, and manage tenants all
            in one place with our enterprise-grade management suite.
          </p>

          <Button size="lg" asChild variant="default" className="mt-4">
            <Link href="/dashboard">Get started</Link>
          </Button>
        </div>

        {/**Image wrapper */}
        <div className="relative w-full aspect-square md:aspect-4/3 lg:aspect-square">
          <Image
            src="/hero-img.jpg"
            alt="Hero Image"
            fill
            className="rounded-2xl shadow-2xl object-cover border"
            priority
          />
        </div>
      </section>

      {/**Bottom section */}
      <section className="flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            A complete ecosystem for asset growth.
          </h2>
          <p className="text-muted-foreground text-lg">
            Precision-engineered tools to automate your workflow and secure your
            investments.
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
