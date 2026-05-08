import { mockProperties } from "../page";
import { SidebarTrigger } from "@/components/ui/sidebar";
import PropertyHeroSection from "@/components/properties/property-hero-section";
import { FaMoneyBills } from "react-icons/fa6";
import IndicatorCard from "@/components/indicator-card";
import { IoMdTrendingUp } from "react-icons/io";
import { FiUsers } from "react-icons/fi";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === Number(id));

  const indicators: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    topRight?: React.ReactNode;
  }[] = [
    {
      icon: FaMoneyBills,
      title: "MESAČNÝ NÁJOM",
      value: "550€",
      topRight: (
        <span className="text-xs text-green-500">+15% od minulého mesiaca</span>
      ),
    },
    {
      icon: IoMdTrendingUp,
      title: "ROČNÝ VÝNOS",
      value: "5.82%",
    },
    {
      icon: FiUsers,
      title: "OBSADENOSŤ",
      value: "100%",
      topRight: (
        <span className="text-xs text-muted-foreground">Od 01.06.2023</span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/**Header */}
      <div className="flex border-b p-5 gap-2 items-center">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-semibold tracking-tight ">
          Detail nehnuteľnosti
        </h1>
      </div>

      {/**Content */}
      <div className="flex-1 p-5">
        {/**sm:grid-cols-2 */}
        {property && <PropertyHeroSection property={property} />}

        {/**Indicators */}
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {indicators.map((indicator, index) => (
            <li key={index}>
              <IndicatorCard {...indicator} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
