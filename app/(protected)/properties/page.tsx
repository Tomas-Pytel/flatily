import { PropertyCardInfo } from "@/components/properties/property-card-info";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Property } from "@/features/dashboard/types/types";
import Link from "next/link";

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

export default function PropertiesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b p-5 gap-2 items-center">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-semibold tracking-tight ">Prehľad</h1>
      </div>
      <div className="p-5">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockProperties.map((property) => (
            <li key={property.id}>
              <Link href={`/properties/${property.id}`}>
                <PropertyCardInfo property={property} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
