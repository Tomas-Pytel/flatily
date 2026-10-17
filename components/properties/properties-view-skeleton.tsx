"use client";

import Skeleton from "@/components/loading-skeleton";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

function ToolbarSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#141414] md:flex-row md:items-center">
      <div className="flex items-center gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-20 shrink-0 rounded-lg" />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2.5">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden shadow-xs">
      <div>
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="space-y-3 p-4">
          <div>
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="mt-2 h-3 w-4/5" />
          </div>
          <div className="flex justify-between border-t pt-2">
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-5 w-24" />
            </div>
            <div className="text-right">
              <Skeleton className="ml-auto h-3 w-14" />
              <Skeleton className="mt-2 h-4 w-16" />
            </div>
          </div>
          <div className="flex justify-between border-t pt-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
      </div>
    </Card>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#141414]">
      <div className="space-y-0 p-4">
        <Skeleton className="h-8 w-full rounded-none" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="mt-3 h-12 w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}

export function PropertiesViewSkeleton({
  viewMode,
}: {
  viewMode: "grid" | "table";
}) {
  return (
    <>
      <ToolbarSkeleton />
      {viewMode === "table" ? <TableSkeleton /> : <GridSkeleton />}
    </>
  );
}

export function PropertiesViewSkeletonWithSearchParams() {
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") === "table" ? "table" : "grid";

  return <PropertiesViewSkeleton viewMode={viewMode} />;
}
