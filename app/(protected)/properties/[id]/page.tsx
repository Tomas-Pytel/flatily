import { mockProperties } from "../page";
import { SidebarTrigger } from "@/components/ui/sidebar";
import PropertyHeroSection from "@/components/properties/property-hero-section";
import { FaMoneyBills } from "react-icons/fa6";
import IndicatorCard from "@/components/indicator-card";
import { IoMdTrendingUp } from "react-icons/io";
import { FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import TenantInfoCard, {
  TenantInfoCardProps,
} from "@/components/properties/tenant-info-card";
import RepairHistoryTable from "@/components/properties/repair-history-table";
import DocumentsCard, {
  DocumentInfo,
} from "@/components/properties/documents-card";

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

  const tenants: TenantInfoCardProps[] = [
    {
      name: "Ján Novák",
      leaseEndDate: "31.12.2024",
      paymentStatus: "Uhradené",
      deposit: 550,
      phone: "+421 900 123 456",
      email: "jannovak@gmail.com",
      image: "/avatar-img.jpg",
    },
    {
      name: "Ján Novák",
      leaseEndDate: "31.12.2024",
      paymentStatus: "Uhradené",
      deposit: 550,
      phone: "+421 900 123 456",
      email: "jannovak@gmail.com",
      image: "/avatar-img.jpg",
    },
  ];

  const repairs = [
    {
      id: 1,
      date: "15.5.2024",
      workType: "Servis klimatizácie",
      provider: "Technická služba s.r.o.",
      cost: 150,
    },
    {
      id: 2,
      date: "10.4.2024",
      workType: "Oprava vodovodného kohútika",
      provider: "Vodoinštalatér Ján",
      cost: 80,
    },
    {
      id: 3,
      date: "10.4.2024",
      workType: "Oprava vodovodného kohútika",
      provider: "Vodoinštalatér Ján",
      cost: 80,
    },
    {
      id: 4,
      date: "10.4.2024",
      workType: "Oprava vodovodného kohútika",
      provider: "Vodoinštalatér Ján",
      cost: 80,
    },
    {
      id: 5,
      date: "10.4.2024",
      workType: "Oprava vodovodného kohútika",
      provider: "Vodoinštalatér Ján",
      cost: 80,
    },
    {
      id: 6,
      date: "10.4.2024",
      workType: "Oprava vodovodného kohútika",
      provider: "Vodoinštalatér Ján",
      cost: 80,
    },
  ];

  const documents: DocumentInfo = [
    {
      id: "1",
      title: "Nájomná zmluva.pdf",
      date: "01.06.2023",
      size: "1.2 MB",
      icon: File,
    },
    {
      id: "2",
      title: "Preberaci_protokol.pdf",
      date: "01.06.2023",
      size: "1.2 MB",
      icon: File,
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
      <div className="flex flex-col flex-1 p-5 gap-5">
        {/**sm:grid-cols-2 */}
        {property && <PropertyHeroSection property={property} />}

        {/**Indicators */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {indicators.map((indicator, index) => (
            <li key={index}>
              <IndicatorCard {...indicator} />
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/**Tenant information */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="md:text-lg font-medium">Aktuálni nájomcovia</h3>
              <Button variant="outline" size="sm">
                História nájmov
              </Button>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {tenants.map((tenant, index) => (
                <li key={index}>
                  <TenantInfoCard {...tenant} />
                </li>
              ))}
            </ul>
          </div>

          {/**History of repairs */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="md:text-lg font-medium">História opráv</h3>
              <Button variant="outline" size="sm">
                Pridať opravu
              </Button>
            </div>
            <RepairHistoryTable repairs={repairs} />
          </div>

          {/**Documents */}
          <div>
            <DocumentsCard documents={documents} />
          </div>
        </div>
      </div>
    </div>
  );
}
