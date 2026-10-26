"use client";

import { ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  const buttonClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
      active
        ? "bg-primary text-white dark:bg-primary dark:text-neutral-900 shadow-xs"
        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
    }`;

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#141414] md:flex-row md:items-center">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none md:pb-0">
        <button
          className={buttonClass(statusFilter === "all")}
          onClick={() => updateParam("status", "all")}
        >
          Všetky ({apartments.length})
        </button>
        <button
          className={buttonClass(statusFilter === "obsadeny")}
          onClick={() => updateParam("status", "obsadeny")}
        >
          Obsadené ({apartments.filter((a) => a.status === "obsadeny").length})
        </button>
        <button
          className={buttonClass(statusFilter === "volny")}
          onClick={() => updateParam("status", "volny")}
        >
          Voľné ({apartments.filter((a) => a.status === "volny").length})
        </button>
        <button
          className={buttonClass(statusFilter === "problem_platba")}
          onClick={() => updateParam("status", "problem_platba")}
        >
          Problém s platbou
        </button>
        <button
          className={buttonClass(statusFilter === "oprava")}
          onClick={() => updateParam("status", "oprava")}
        >
          Oprava ({openRepairsCount})
        </button>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <Select
            value={sortBy}
            onValueChange={(value) => updateParam("sort", value as SortByType)}
          >
            <SelectTrigger className="w-[180] cursor-pointer rounded-lg border-none bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200">
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
          <button
            onClick={() => updateParam("view", "grid")}
            className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-neutral-100" : "text-neutral-400"} cursor-pointer`}
            title="Mriežka"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => updateParam("view", "table")}
            className={`rounded-md p-1.5 ${viewMode === "table" ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-neutral-100" : "text-neutral-400"} cursor-pointer`}
            title="Tabuľka"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
