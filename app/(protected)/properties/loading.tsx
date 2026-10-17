import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import Skeleton from "@/components/loading-skeleton";
import {
  PropertiesViewSkeleton,
  PropertiesViewSkeletonWithSearchParams,
} from "@/components/properties/properties-view-skeleton";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Moje nehnuteľnosti">
        <Skeleton className="h-8 w-24 rounded-md" />
      </AppHeader>
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<PropertiesViewSkeleton viewMode="grid" />}>
          <PropertiesViewSkeletonWithSearchParams />
        </Suspense>
      </main>
    </div>
  );
}
