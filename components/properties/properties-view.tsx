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

// --- MOCK DÁTA ---
const mockApartments = [
  {
    id: "1",
    name: "Slnečný 2-izbák v Centre",
    address: "Hlavná 15",
    city: "Bratislava",
    district: "Staré Mesto",
    area: 55,
    rooms: 2,
    floor: 3,
    totalFloors: 5,
    rentAmount: 750,
    utilitiesAmount: 150,
    status: "obsadeny" as const,
    currentTenantId: "t1",
    paymentStatus: "Uhradené",
  },
  {
    id: "2",
    name: "Moderný loft pri rieke",
    address: "Nábrežná 8",
    city: "Bratislava",
    district: "Ružinov",
    area: 42,
    rooms: 1,
    floor: 2,
    totalFloors: 8,
    rentAmount: 600,
    utilitiesAmount: 120,
    status: "volny" as const,
    currentTenantId: null,
    photoUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60",
    paymentStaus: "Omeškané",
  },
];

const mockTenants = [{ id: "t1", firstName: "Jozef", lastName: "Mrkvička" }];

const mockPayments = [
  { id: "p1", apartmentId: "1", period: "Október 2026", status: "Uhradené" },
];

const mockMaintenance = [{ id: "m1", apartmentId: "1", status: "open" }];
// -----------------

export const ApartmentsView: React.FC = () => {
  // Lokálne stavy nahrádzajúce kontext
  const [apartments, setApartments] = useState(mockApartments);
  const [searchQuery, setSearchQuery] = useState("");

  // Stavy zobrazenia
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [sortBy, setSortBy] = useState<SortByType>("name");
  const [viewMode, setViewMode] = useState<ViewModeType>("grid");

  // Funkcie nahrádzajúce kontextové akcie
  const navigateTo = (view: string, id: string) => {
    console.log(`Navigating to ${view} with ID ${id}`);
  };

  const handleDelete = (id: string, name: string) => {
    const isConfirmed = window.confirm(
      `Naozaj chcete zmazať byt "${name}"? Akciu nie je možné vrátiť späť.`,
    );
    if (isConfirmed) {
      setApartments((prev) => prev.filter((apt) => apt.id !== id));
      console.log("Deleted apartment:", id);
    }
  };

  const filteredApartments = useMemo(() => {
    return apartments
      .filter((apt) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          apt.name.toLowerCase().includes(query) ||
          apt.address.toLowerCase().includes(query) ||
          apt.city.toLowerCase().includes(query) ||
          apt.district.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // Status filter
        if (statusFilter === "all") return true;
        if (statusFilter === "obsadeny") return apt.status === "obsadeny";
        if (statusFilter === "volny") return apt.status === "volny";
        if (statusFilter === "problem_platba") {
          const aptPayment = mockPayments.find(
            (p) => p.apartmentId === apt.id && p.status === "omeskane",
          );
          return apt.status === "problem" || !!aptPayment;
        }
        if (statusFilter === "oprava") {
          const aptRepair = mockMaintenance.find(
            (m) => m.apartmentId === apt.id && m.status !== "resolved",
          );
          return !!aptRepair;
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
  }, [apartments, searchQuery, statusFilter, sortBy]);

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
        apartments={apartments}
        maintenance={mockMaintenance}
      />

      {/* Content Rendering: Grid vs Table vs Empty */}
      {filteredApartments.length === 0 ? (
        <span>Zatiaľ nemáte žiadny byt</span>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApartments.map((apt) => {
            const tenant = mockTenants.find(
              (t) => t.id === apt.currentTenantId,
            );
            const tenantName = tenant
              ? `${tenant.firstName} ${tenant.lastName}`
              : null;
            const aptPayment = mockPayments.find(
              (p) => p.apartmentId === apt.id && p.period === "Október 2026",
            );
            const openRepairs = mockMaintenance.filter(
              (m) => m.apartmentId === apt.id && m.status !== "resolved",
            );

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
                tenantName={tenantName}
                paymentStatus={aptPayment?.status}
                openRepairsCount={openRepairs.length}
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
                  const tenant = mockTenants.find(
                    (t) => t.id === apt.currentTenantId,
                  );
                  const aptPayment = mockPayments.find(
                    (p) =>
                      p.apartmentId === apt.id && p.period === "Október 2026",
                  );

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
                          <img
                            src={apt.photoUrl}
                            alt=""
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
                        {tenant
                          ? `${tenant.firstName} ${tenant.lastName}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        {aptPayment ? (
                          <Badge>{aptPayment.status} </Badge>
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
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.id, apt.name)}
                            className="p-1.5 text-neutral-400 hover:text-[#DC2626] dark:hover:text-[#EF4444] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                            title="Zmazať"
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
