"use client";

import { ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyListItem } from "@/types/property";

export type StatusFilterType =
  | "all"
  | "obsadeny"
  | "volny"
  | "problem_platba"
  | "oprava";
export type SortByType = "name" | "rent_desc" | "rent_asc" | "status";
export type ViewModeType = "grid" | "table";

type ApartmentsToolbarProps = {
  statusFilter: StatusFilterType;
  sortBy: SortByType;
  viewMode: ViewModeType;
  apartments: Pick<PropertyListItem, "id" | "status">[];
  openRepairsCount: number;
};

const sortItems: Array<{ label: string; value: SortByType }> = [
  { label: "Podľa názvu", value: "name" },
  { label: "Nájom: najvyšší", value: "rent_desc" },
  { label: "Nájom: najnižší", value: "rent_asc" },
  { label: "Podľa stavu", value: "status" },
];

export function PropertiesToolbar({
  statusFilter,
  sortBy,
  viewMode,
  apartments,
  openRepairsCount,
}: ApartmentsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(
    key: "status" | "sort" | "view",
    value: StatusFilterType | SortByType | ViewModeType,
  ) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#141414] md:flex-row md:items-center">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none md:pb-0">
        <Button
          type="button"
          size="sm"
          variant={statusFilter === "all" ? "default" : "ghost"}
          aria-pressed={statusFilter === "all"}
          className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "all"
              ? "bg-primary text-white shadow-xs dark:bg-primary dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
          onClick={() => updateParam("status", "all")}
        >
          Všetky ({apartments.length})
        </Button>
        <Button
          type="button"
          size="sm"
          variant={statusFilter === "obsadeny" ? "default" : "ghost"}
          aria-pressed={statusFilter === "obsadeny"}
          className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "obsadeny"
              ? "bg-primary text-white shadow-xs dark:bg-primary dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
          onClick={() => updateParam("status", "obsadeny")}
        >
          Obsadené ({apartments.filter((a) => a.status === "obsadeny").length})
        </Button>
        <Button
          type="button"
          size="sm"
          variant={statusFilter === "volny" ? "default" : "ghost"}
          aria-pressed={statusFilter === "volny"}
          className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "volny"
              ? "bg-primary text-white shadow-xs dark:bg-primary dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
          onClick={() => updateParam("status", "volny")}
        >
          Voľné ({apartments.filter((a) => a.status === "volny").length})
        </Button>
        <Button
          type="button"
          size="sm"
          variant={statusFilter === "problem_platba" ? "default" : "ghost"}
          aria-pressed={statusFilter === "problem_platba"}
          className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "problem_platba"
              ? "bg-primary text-white shadow-xs dark:bg-primary dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
          onClick={() => updateParam("status", "problem_platba")}
        >
          Problém s platbou
        </Button>
        <Button
          type="button"
          size="sm"
          variant={statusFilter === "oprava" ? "default" : "ghost"}
          aria-pressed={statusFilter === "oprava"}
          className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "oprava"
              ? "bg-primary text-white shadow-xs dark:bg-primary dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
          onClick={() => updateParam("status", "oprava")}
        >
          Oprava ({openRepairsCount})
        </Button>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <Select
            value={sortBy}
            onValueChange={(value) => updateParam("sort", value as SortByType)}
          >
            <SelectTrigger className="w-45 cursor-pointer rounded-lg border-none bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200">
              <SelectValue placeholder="Vyberte možnosť" />
            </SelectTrigger>
            <SelectContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <SelectGroup>
                {sortItems.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="cursor-pointer text-xs focus:bg-neutral-100 dark:focus:bg-neutral-900"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center rounded-lg bg-neutral-100 p-0.5 dark:bg-neutral-800">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => updateParam("view", "grid")}
            className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-neutral-100 hover:bg-white hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-100" : "text-neutral-400 hover:bg-white/60 hover:text-neutral-700 dark:hover:bg-neutral-900/60 dark:hover:text-neutral-200"} cursor-pointer`}
            title="Mriežka"
            aria-label="Zobraziť ako mriežku"
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => updateParam("view", "table")}
            className={`rounded-md p-1.5 ${viewMode === "table" ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-neutral-100 hover:bg-white hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-100" : "text-neutral-400 hover:bg-white/60 hover:text-neutral-700 dark:hover:bg-neutral-900/60 dark:hover:text-neutral-200"} cursor-pointer`}
            title="Tabuľka"
            aria-label="Zobraziť ako tabuľku"
            aria-pressed={viewMode === "table"}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
