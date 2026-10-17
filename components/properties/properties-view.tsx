"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye } from "lucide-react";
import {
  PropertiesToolbar,
  StatusFilterType,
  SortByType,
  ViewModeType,
} from "@/components/properties/properties-toolbar";
import { ExtendedPropertyCard } from "./extended-property-card";
import Image from "next/image";
import { PropertyListItem } from "@/app/(protected)/properties/page";
import { deleteProperty } from "@/app/actions/properties";
import { useRouter } from "next/navigation";

interface ApartmentsViewProps {
  properties: PropertyListItem[];
}

export const ApartmentsView = ({ properties }: ApartmentsViewProps) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [sortBy, setSortBy] = useState<SortByType>("name");
  const [viewMode, setViewMode] = useState<ViewModeType>("grid");
  const navigateTo = (view: string, id: string) => {
    console.log(`Navigating to ${view} with ID ${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = window.confirm(
      `Naozaj chcete zmazať byt "${name}"? Akciu nie je možné vrátiť späť.`,
    );
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteProperty(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete property:", error);
      window.alert("Nehnuteľnosť sa nepodarilo zmazať. Skúste to znova.");
    }
  };

  const filteredApartments = useMemo(() => {
    return properties
      .filter((apt) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "obsadeny") return apt.status === "obsadeny";
        if (statusFilter === "volny") return apt.status === "volny";
        if (statusFilter === "problem_platba") {
          return apt.paymentStatus === "Omeškané";
        }
        if (statusFilter === "oprava") {
          return apt.openRepairsCount > 0;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "rent_desc") return b.rentAmount - a.rentAmount;
        if (sortBy === "rent_asc") return a.rentAmount - b.rentAmount;
        if (sortBy === "status") return a.status.localeCompare(b.status);
        return 0;
      });
  }, [properties, statusFilter, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Vložený Toolbar s predanými dátami */}
      <PropertiesToolbar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        apartments={properties}
        openRepairsCount={properties.reduce(
          (total, apartment) => total + apartment.openRepairsCount,
          0,
        )}
      />

      {/* Content Rendering: Grid vs Table vs Empty */}
      {filteredApartments.length === 0 ? (
        <span>Zatiaľ nemáte žiadny byt</span>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApartments.map((apt) => {
            return (
              <ExtendedPropertyCard
                key={apt.id}
                id={apt.id}
                name={apt.name}
                address={apt.address}
                city={apt.city}
                district={apt.district}
                area={apt.area}
                rooms={apt.rooms}
                floor={apt.floor}
                totalFloors={apt.totalFloors}
                rentAmount={apt.rentAmount}
                utilitiesAmount={apt.utilitiesAmount}
                photoUrl={apt.photoUrl}
                tenantName={apt.tenantName}
                paymentStatus={apt.paymentStatus}
                openRepairsCount={apt.openRepairsCount}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Byt</th>
                  <th className="px-4 py-3">Lokalita</th>
                  <th className="px-4 py-3">Parametre</th>
                  <th className="px-4 py-3 text-right">Mesačný nájom</th>
                  <th className="px-4 py-3">Nájomník</th>
                  <th className="px-4 py-3">Platba (Okt)</th>
                  <th className="px-4 py-3">Stav</th>
                  <th className="px-4 py-3 text-right">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredApartments.map((apt) => {
                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div
                          onClick={() => navigateTo("property-detail", apt.id)}
                          className="font-semibold text-neutral-900 dark:text-neutral-100 cursor-pointer hover:text-[#004AAD] dark:hover:text-[#3B82F6] flex items-center gap-2.5"
                        >
                          <Image
                            src={apt.photoUrl || "/avatar-img.jpg"}
                            alt={`Náhľad nehnuteľnosti ${apt.name}`}
                            width={32}
                            height={32}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-md object-cover"
                          />
                          <span>{apt.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400">
                        {apt.address}, {apt.city}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-500 tabular-nums">
                        {apt.area} m² · {apt.rooms} izb.
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                        €{apt.rentAmount}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                        {apt.tenantName ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        {apt.paymentStatus ? (
                          <Badge>{apt.paymentStatus} </Badge>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge>{apt.status}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              navigateTo("property-detail", apt.id)
                            }
                            className="p-1.5 text-[#004AAD] dark:text-[#3B82F6] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                            title="Detail"
                            aria-label={`Otvoriť detail nehnuteľnosti ${apt.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.id, apt.name)}
                            className="p-1.5 text-neutral-400 hover:text-[#DC2626] dark:hover:text-[#EF4444] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                            title="Zmazať"
                            aria-label={`Zmazať nehnuteľnosť ${apt.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
