import { MyProperties } from "@/components/dashboard/my-properties";
import { Card } from "@/components/ui/card";
import Skeleton from "@/components/common/loading-skeleton";
import { getRecentProperties } from "@/lib/dashboard";

type RecentPropertiesProps = {
  userId: string;
  now: Date;
  today: Date;
  currentMonth: Date;
  twelveMonthsAgo: Date;
};

export async function RecentProperties({
  userId,
  today,
  currentMonth,
}: RecentPropertiesProps) {
  const { properties, totalCount } = await getRecentProperties({
    userId,
    currentMonth,
    today,
  });
  const period = currentMonth.toLocaleDateString("sk-SK", {
    month: "long",
    year: "numeric",
  });
  const apartments = properties.map((property) => ({
    id: property.id,
    name: property.name,
    city: property.city,
    district: property.district,
    photoUrl: property.photoUrl,
    rentAmount: property.rentAmount,
    area: property.area,
    rooms: property.rooms,
    currentTenantId: property.tenant?.id ?? null,
  }));

  return (
    <MyProperties
      apartments={apartments}
      totalCount={totalCount}
      tenants={properties.flatMap((property) =>
        property.tenant ? [property.tenant] : [],
      )}
      payments={properties.flatMap((property) =>
        property.paymentStatus
          ? [{ apartmentId: property.id, period, status: property.paymentStatus }]
          : [],
      )}
      period={period}
    />
  );
}

export function RecentPropertiesSkeleton() {
  return (
    <section>
      <div className="mb-4 flex justify-between">
        <div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-3 w-48" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-56 shadow-none">
            <Skeleton className="h-32 w-full rounded-t-xl rounded-b-none" />
            <Skeleton className="mx-4 mt-4 h-4 w-32" />
            <Skeleton className="mx-4 mt-2 h-3 w-24" />
          </Card>
        ))}
      </div>
    </section>
  );
}
