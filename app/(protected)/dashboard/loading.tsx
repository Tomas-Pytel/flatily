import { DashboardHeader } from "@/components/dashboard-header";
import Skeleton from "@/components/loading-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Prehľad" />

      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8">
        {/* Indicator cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-7 w-24" />
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Maintenance list skeleton */}
          <section className="lg:col-span-2 flex flex-col gap-4">
            <Skeleton className="h-6 w-44" />
            <Card className="h-full">
              <CardContent className="p-0">
                <ul className="divide-y">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex items-start gap-4 p-4">
                      {/* Icon placeholder */}
                      <Skeleton className="size-8 rounded-full shrink-0 mt-0.5" />
                      {/* Text block */}
                      <div className="flex-1 space-y-2 pt-0.5">
                        <Skeleton className="h-3.5 w-48" />
                        <Skeleton className="h-3 w-36" />
                        <Skeleton className="h-2.5 w-28 mt-1" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Quick actions skeleton */}
          <section className="flex flex-col gap-4">
            <Skeleton className="h-6 w-28" />
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-3 w-36" />
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
