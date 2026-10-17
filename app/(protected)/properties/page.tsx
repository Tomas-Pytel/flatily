import { AppHeader } from "@/components/app-header";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { ApartmentsView } from "@/components/properties/properties-view";
import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/browser";

type PropertyPaymentStatus = "Uhradené" | "Čakajúce" | "Omeškané";

function getCurrentMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

const propertySelect = {
  id: true,
  title: true,
  street: true,
  city: true,
  district: true,
  monthlyRent: true,
  utilitiesAmount: true,
  rooms: true,
  area: true,
  floor: true,
  totalFloors: true,
  images: {
    where: {
      isCover: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    take: 1,
    select: {
      url: true,
    },
  },
  leases: {
    where: {
      status: "ACTIVE",
    },
    select: {
      tenant: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      charges: {
        where: {
          period: getCurrentMonthStart(),
        },
        select: {
          amount: true,
          dueDate: true,
          payments: {
            select: {
              amount: true,
            },
          },
        },
        take: 1,
      },
    },
  },
  maintenance: {
    where: {
      status: {
        in: ["OPEN", "IN_PROGRESS"],
      },
    },
    select: {
      id: true,
    },
  },
} satisfies Prisma.PropertySelect;

export type PropertyListItem = {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  area: number;
  rooms: number;
  floor: number;
  totalFloors: number;
  rentAmount: number;
  utilitiesAmount: number;
  photoUrl: string | null;
  tenantName: string | null;
  status: "obsadeny" | "volny";
  paymentStatus: PropertyPaymentStatus | null;
  openRepairsCount: number;
};

export default async function PropertiesPage() {
  const user = await requireUser();

  const propertyRows = await prisma.property.findMany({
    select: propertySelect,
    where: {
      ownerId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });
  const properties: PropertyListItem[] = propertyRows.map((property) => {
    const activeTenant = property.leases[0]?.tenant;
    const charge = property.leases[0]?.charges[0];
    const paidAmount =
      charge?.payments.reduce((sum, payment) => sum + Number(payment.amount), 0) ??
      0;
    const paymentStatus: PropertyPaymentStatus | null = charge
      ? paidAmount >= Number(charge.amount)
        ? "Uhradené"
        : charge.dueDate < new Date()
          ? "Omeškané"
          : "Čakajúce"
      : null;

    return {
      id: property.id,
      name: property.title,
      address: property.street,
      city: property.city,
      district: property.district ?? "",
      area: Number(property.area),
      rooms: property.rooms,
      floor: property.floor,
      totalFloors: property.totalFloors,
      rentAmount: Number(property.monthlyRent),
      utilitiesAmount: Number(property.utilitiesAmount),
      photoUrl: property.images[0]?.url ?? null,
      tenantName: activeTenant
        ? `${activeTenant.firstName} ${activeTenant.lastName}`
        : null,
      status: activeTenant ? "obsadeny" : "volny",
      paymentStatus,
      openRepairsCount: property.maintenance.length,
    };
  });

  return (
    <div className="flex h-full flex-col">
      {/**Header */}
      <AppHeader
        title="Moje nehnuteľnosti"
        subtitle="Spravujte svoje byty, nájomníkov a nájomné zmluvy."
      >
        <Bell className="size-4 text-muted-foreground/70" />
      </AppHeader>

      {/**Properties list */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* 2. Responsive Grid */}
        <ApartmentsView properties={properties} />
      </main>
    </div>
  );
}
