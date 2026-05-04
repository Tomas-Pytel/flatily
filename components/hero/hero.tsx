import { Button } from "../ui/button";
import Image from "next/image";
import { FaMoneyBills } from "react-icons/fa6";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaRegFileLines } from "react-icons/fa6";
import { InfoCard } from "./info-card";

export interface InformationCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function Hero() {
  const infoCards: InformationCard[] = [
    {
      title: "Automated Financials",
      description:
        "Real-time rent collection, expense tracking, and instant owner disbursements via encrypted ledger.",
      icon: <FaMoneyBills />,
    },
    {
      title: "Smart Maintenance",
      description:
        "Predictive AI identifying repair needs before they become costly emergencies for your properties.",
      icon: <HiWrenchScrewdriver />,
    },
    {
      title: "Compliance Engine",
      description:
        "Stay updated with local regulations and automated lease generation backed by legal frameworks.",
      icon: <FaRegFileLines />,
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl gap-16 items-center px-5">
      <section className="flex flex-col md:flex-row w-full max-w-7xl gap-16 items-center px-5">
        <div className="flex flex-col gap-6 max-w-4xl md:w-3/4">
          <h1 className="text-4xl md:text-6xl font-bold text-center md:text-start">
            Institutional Stability for Modern Property Owners.
          </h1>
          <p className="text-lg text-center md:text-start mt-4 text-muted-foreground">
            Streamline your rentals, automate payments, and manage tenants all
            in one place with our enterprise-grade management suite.
          </p>
          <div className="flex flex-col items-center md:items-start">
            <Button variant="default">Get started</Button>
          </div>
        </div>
        <div className="relative w-full aspect-square ">
          <Image
            src="/hero-img.jpg"
            alt="Hero Image"
            fill
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
      </section>
      <section className="flex flex-col w-full max-w-7xl justify-center">
        <div className="flex flex-col items-center">
          <p className="text-3xl text-center">
            A complete ecosystem for asset growth.
          </p>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl">
            Precision-engineered tools to automate your workflow and secure your
            investments.
          </p>
        </div>
        <ul className="flex flex-col md:flex-row md:items-stretch gap-8 mt-8 items-center justify-center">
          {infoCards.map((card, index) => {
            return (
              <li key={index} className="flex flex-1">
                <InfoCard card={card} />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
