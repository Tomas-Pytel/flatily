import { AppHeader } from "@/components/common/app-header";
import Skeleton from "@/components/common/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Nájomníci">
        <Skeleton className="h-8 w-24 rounded-md" />
      </AppHeader>
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#141414] sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-full sm:max-w-xs" />
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#141414]">
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-4 border-b border-neutral-100 pb-4 last:border-0 dark:border-neutral-800 sm:grid-cols-4 lg:grid-cols-8"
              >
                {Array.from({ length: 8 }, (_, cellIndex) => (
                  <Skeleton
                    key={cellIndex}
                    className="h-5 w-full max-w-28"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
