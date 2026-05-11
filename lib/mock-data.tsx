import { Indicator } from "@/app/(protected)/properties/[id]/page";
import { DocumentInfo, Property } from "@/types/property";
import { TenantInfo } from "@/types/tenant";
import { Banknote, FileText, TrendingUp, Users } from "lucide-react";

export const mockProperties: Property[] = [
  {
    id: 1,
    title: "Moderný 2-izbový byt v centre mesta",
    description: "Priestranný byt s balkónom a výhľadom na park.",
    city: "Bratislava",
    street: "Šancová 12",
    postalCode: "81105",
    img: "/hero-img.jpg",
  },
  {
    id: 2,
    title: "Útulná garsónka blízko centra",
    description: "Ideálne pre jednotlivca, kompletne zariadená.",
    city: "Bratislava",
    street: "Račianska 45",
    postalCode: "83102",
    img: "/twitter-image.png",
  },
  {
    id: 3,
    title: "Rodinný dom so záhradou",
    description: "Tichá lokalita, veľká záhrada a garáž.",
    city: "Trnava",
    street: "Jarná 8",
    postalCode: "91701",
  },
  {
    id: 4,
    title: "Luxusný penthouse s terasou",
    description: "Panoramatický výhľad na mesto, top lokalita.",
    city: "Bratislava",
    street: "Dunajská 3",
    postalCode: "81108",
  },
  {
    id: 5,
    title: "3-izbový byt po rekonštrukcii",
    description: "Moderná kuchyňa, blízko MHD a škôl.",
    city: "Nitra",
    street: "Mostná 21",
    postalCode: "94901",
  },
  {
    id: 6,
    title: "Chata v prírode",
    description: "Perfektné na víkendy, blízko lesa a turistiky.",
    city: "Žilina",
    street: "Lesná 99",
    postalCode: "01001",
  },
  {
    id: 7,
    title: "Štýlový loft v industriálnom štýle",
    description: "Vysoké stropy, otvorený priestor, unikátny dizajn.",
    city: "Košice",
    street: "Továrenská 14",
    postalCode: "04001",
  },
  {
    id: 8,
    title: "Novostavba 4-izbového bytu",
    description: "Energeticky úsporný, parkovanie v garáži.",
    city: "Prešov",
    street: "Slnečná 5",
    postalCode: "08001",
  },
];

export const tenants: TenantInfo[] = [
export const tenants: TenantInfo[] = [
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

export const repairs = [
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

export const documents: DocumentInfo[] = [
  {
    id: "1",
    title: "Nájomná zmluva.pdf",
    date: "01.06.2023",
    size: "1.2 MB",
    icon: FileText,
  },
  {
    id: "2",
    title: "Preberaci_protokol.pdf",
    date: "01.06.2023",
    size: "1.2 MB",
    icon: FileText,
  },
];

export const indicators: Indicator[] = [
  {
    icon: Banknote,
    title: "MESAČNÝ NÁJOM",
    value: "550€",
    topRight: (
      <span className="text-xs text-green-500">+15% od minulého mesiaca</span>
    ),
  },
  {
    icon: TrendingUp,
    title: "ROČNÝ VÝNOS",
    value: "5.82%",
  },
  {
    icon: Users,
    title: "OBSADENOSŤ",
    value: "100%",
    topRight: (
      <span className="text-xs text-muted-foreground">Od 01.06.2023</span>
    ),
  },
];
