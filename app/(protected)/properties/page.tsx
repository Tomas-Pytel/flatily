import { AppHeader } from "@/components/common/app-header";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { ApartmentsView } from "@/components/properties/properties-view";
import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/browser";
import { getToday, isPastDue } from "@/lib/utils";
import type { PaymentStatus, PropertyListItem } from "@/types/property";
import type {
  SortByType,
  StatusFilterType,
  ViewModeType,
} from "@/components/properties/properties-toolbar";

function getPropertySelect(period: Date) {
  return {
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
      orderBy: {
        startDate: "desc",
      },
      take: 1,
      select: {
        tenant: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        charges: {
          where: {
            period,
          },
          orderBy: {
            dueDate: "desc",
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
}

type PropertiesSearchParams = {
  status?: string;
  sort?: string;
  view?: string;
};

const statusFilters: StatusFilterType[] = [
  "all",
  "obsadeny",
  "volny",
  "problem_platba",
  "oprava",
];
const sortOptions: SortByType[] = ["name", "rent_desc", "rent_asc", "status"];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<PropertiesSearchParams>;
}) {
  const user = await requireUser();
  const today = getToday();
  const params = await searchParams;
  const statusFilter = statusFilters.includes(params.status as StatusFilterType)
    ? (params.status as StatusFilterType)
    : "all";
  const sortBy = sortOptions.includes(params.sort as SortByType)
    ? (params.sort as SortByType)
    : "name";
  const viewMode: ViewModeType = params.view === "table" ? "table" : "grid";
  const currentMonthStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
  );

  const propertyRows = await prisma.property.findMany({
    select: getPropertySelect(currentMonthStart),
    where: {
      ownerId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });
  const properties: PropertyListItem[] = propertyRows.map((property) => {
    const activeTenant = property.leases[0]?.tenant;
    const charge = property.leases[0]?.charges[0];
    const paidAmount =
      charge?.payments.reduce(
        (sum, payment) => sum.plus(payment.amount),
        new Prisma.Decimal(0),
      ) ?? new Prisma.Decimal(0);
    const paymentStatus: PaymentStatus | null = charge
      ? paidAmount.gte(charge.amount)
        ? "Uhradené"
        : isPastDue(charge.dueDate, today)
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
      {/*Header */}
      <AppHeader
        title="Moje nehnuteľnosti"
        subtitle="Spravujte svoje byty, nájomníkov a nájomné zmluvy."
        primaryAction={{
          label: "Pridať nový byt",
          href: "/properties/new",
        }}
      >
        <Bell className="size-4 text-muted-foreground/70" />
      </AppHeader>

      {/*Properties list */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Responsive Grid */}
        <ApartmentsView
          properties={properties}
          statusFilter={statusFilter}
          sortBy={sortBy}
          viewMode={viewMode}
        />
      </main>
    </div>
  );
}
