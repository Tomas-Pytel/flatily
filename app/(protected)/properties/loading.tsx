// app/properties/loading.tsx
import { DashboardHeader } from "@/components/dashboard-header";
import Skeleton from "@/components/loading-skeleton";

function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3 h-full">
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-lg" />
      {/* Title */}
      <Skeleton className="h-4 w-3/4" />
      {/* Address */}
      <Skeleton className="h-3 w-1/2" />
      {/* Tags / badges row */}
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Moje nehnuteľnosti">
        {/* Button placeholder */}
        <Skeleton className="h-8 w-24 rounded-md" />
      </DashboardHeader>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <PropertyCardSkeleton />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
