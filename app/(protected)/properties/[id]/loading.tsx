// app/properties/[id]/loading.tsx
import { DashboardHeader } from "@/components/dashboard-header";
import Skeleton from "@/components/loading-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function IndicatorCardSkeleton() {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-14" />
      </div>
      <Skeleton className="h-7 w-24" />
    </Card>
  );
}

function TenantCardSkeleton() {
  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
    </Card>
  );
}

function RepairRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 flex-1" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

function DocumentRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="size-8 rounded-md shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-7 w-20 rounded-md" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Detail nehnuteľnosti" />

      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8">
        {/* Hero section */}
        <Card className="overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-5 flex flex-col gap-3">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-2 mt-1">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
        </Card>

        {/* Indicators */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <IndicatorCardSkeleton key={i} />
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Tenants */}
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <TenantCardSkeleton key={i} />
                ))}
              </div>
            </section>

            {/* Repair history */}
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
              <Card>
                <CardContent className="p-0">
                  {/* Table header */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b">
                    {[20, "flex-1", 24, 16].map((w, i) => (
                      <Skeleton
                        key={i}
                        className={`h-2.5 ${typeof w === "number" ? `w-${w}` : "flex-1"}`}
                      />
                    ))}
                  </div>
                  <ul className="divide-y">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <li key={i}>
                        <RepairRowSkeleton />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right column — Documents */}
          <section className="flex flex-col h-full">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i}>
                      <DocumentRowSkeleton />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
