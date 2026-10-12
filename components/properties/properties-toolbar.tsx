import React from "react";
import { ArrowUpDown, LayoutGrid, List, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type StatusFilterType =
  | "all"
  | "obsadeny"
  | "volny"
  | "problem_platba"
  | "oprava";
export type SortByType = "name" | "rent_desc" | "rent_asc" | "status";
export type ViewModeType = "grid" | "table";

interface ApartmentsToolbarProps {
  statusFilter: StatusFilterType;
  setStatusFilter: (status: StatusFilterType) => void;
  sortBy: SortByType;
  setSortBy: (sort: SortByType) => void;
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
  apartments: any[];
  maintenance: any[];
}

const sortItems = [
  { label: "Podľa názvu", value: "name" },
  { label: "Nájom: najvyšší", value: "rent_desc" },
  { label: "Nájom: najnižší", value: "rent_asc" },
  { label: "Podľa stavu", value: "status" },
];

export const PropertiesToolbar: React.FC<ApartmentsToolbarProps> = ({
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  apartments,
  maintenance,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
      {/* Filter Segmented Controls */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "all"
              ? "bg-primary text-white dark:bg-primary dark:text-neutral-900 shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Všetky ({apartments.length})
        </button>
        <button
          onClick={() => setStatusFilter("obsadeny")}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "obsadeny"
              ? "bg-primary text-white dark:bg-primary dark:text-neutral-900 shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Obsadené ({apartments.filter((a) => a.status === "obsadeny").length})
        </button>
        <button
          onClick={() => setStatusFilter("volny")}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "volny"
              ? "bg-primary text-white dark:bg-primary dark:text-neutral-900 shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Voľné ({apartments.filter((a) => a.status === "volny").length})
        </button>
        <button
          onClick={() => setStatusFilter("problem_platba")}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "problem_platba"
              ? "bg-primary text-white dark:bg-primary dark:text-neutral-900 shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Problém s platbou
        </button>
        <button
          onClick={() => setStatusFilter("oprava")}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
            statusFilter === "oprava"
              ? "bg-primary text-white dark:bg-primary dark:text-neutral-900 shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Oprava ({maintenance.filter((m) => m.status !== "resolved").length})
        </button>
      </div>

      {/* Right Controls: Sort & Mode */}
      <div className="flex items-center gap-2.5 shrink-0 justify-end">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <ArrowUpDown className="w-3.5 h-3.5" />

          <Select onValueChange={(value) => setSortBy(value as SortByType)}>
            <SelectTrigger className="w-[180] bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer">
              <SelectValue placeholder="Vyberte možnosť" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
              <SelectGroup>
                {sortItems.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-700 focus:text-neutral-900 dark:focus:text-neutral-50"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Grid / Table Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors hover:cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
            title="Mriežka"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md transition-colors hover:cursor-pointer ${
              viewMode === "table"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
            title="Tabuľka"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
