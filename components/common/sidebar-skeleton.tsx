import Skeleton from "@/components/common/loading-skeleton";

export default function SidebarSkeleton() {
  return (
    <div className="hidden h-full w-64 shrink-0 flex-col gap-4 border-r p-4 md:flex">
      <div className="flex items-center gap-2 px-2 py-1">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="mt-2 flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3 px-2 py-2">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-32" />
        </div>
      </div>
    </div>
  );
}
