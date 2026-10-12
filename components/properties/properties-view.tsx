"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowRight, Eye, MapPin } from "lucide-react";
import {
  PropertiesToolbar,
  StatusFilterType,
  SortByType,
  ViewModeType,
} from "@/components/properties/properties-toolbar";

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
    status: "obsadeny",
    currentTenantId: "t1",
    photoUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1e52d15461?auto=format&fit=crop&w=500&q=60",
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
    status: "volny",
    currentTenantId: null,
    photoUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    name: "Slnečný 3-izbák v Centre",
    address: "Hlavná 15",
    city: "Bratislava",
    district: "Staré Mesto",
    area: 55,
    rooms: 2,
    floor: 3,
    totalFloors: 5,
    rentAmount: 750,
    utilitiesAmount: 150,
    status: "obsadeny",
    currentTenantId: "t1",
    photoUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1e52d15461?auto=format&fit=crop&w=500&q=60",
  },
];

const mockTenants = [{ id: "t1", firstName: "Jozef", lastName: "Mrkvička" }];

const mockPayments = [
  { id: "p1", apartmentId: "1", period: "Október 2026", status: "zaplatené" },
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

  const setIsNewApartmentModalOpen = (isOpen: boolean) => {
    console.log("New Apartment Modal Open:", isOpen);
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
            const aptPayment = mockPayments.find(
              (p) => p.apartmentId === apt.id && p.period === "Október 2026",
            );
            const openRepairs = mockMaintenance.filter(
              (m) => m.apartmentId === apt.id && m.status !== "resolved",
            );

            return (
              <div
                key={apt.id}
                className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={apt.photoUrl}
                      alt={apt.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <Badge>{apt.status}</Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 tabular-nums">
                      <span>{apt.area} m²</span>
                      <span>·</span>
                      <span>{apt.rooms} izb.</span>
                      <span>·</span>
                      <span>
                        Poschodie {apt.floor}/{apt.totalFloors}
                      </span>
                    </div>
                  </div>

                  {/* Information Body */}
                  <div className="p-4.5 space-y-3">
                    <div>
                      <h3
                        onClick={() => navigateTo("property-detail", apt.id)}
                        className="text-base font-semibold text-neutral-900 dark:text-neutral-100 cursor-pointer hover:text-[#004AAD] dark:hover:text-[#3B82F6] transition-colors"
                      >
                        {apt.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                        <span className="truncate">
                          {apt.address}, {apt.city} – {apt.district}
                        </span>
                      </div>
                    </div>

                    {/* Financial details */}
                    <div className="flex items-baseline justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        <div className="text-xs text-neutral-400">
                          Mesačný nájom
                        </div>
                        <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          €{apt.rentAmount}{" "}
                          <span className="text-xs font-normal text-neutral-400">
                            / mes.
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-neutral-400">Energie</div>
                        <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tabular-nums">
                          +€{apt.utilitiesAmount}
                        </div>
                      </div>
                    </div>

                    {/* Tenant & Status footer */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-neutral-400">Nájomník: </span>
                        {tenant ? (
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {tenant.firstName} {tenant.lastName}
                          </span>
                        ) : (
                          <span className="text-[#CA8A04] dark:text-[#EAB308] font-medium">
                            Voľný
                          </span>
                        )}
                      </div>

                      <div>
                        {aptPayment ? (
                          <Badge>{aptPayment.status}</Badge>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">
                            Bez záznamu
                          </span>
                        )}
                      </div>
                    </div>

                    {openRepairs.length > 0 && (
                      <div className="text-[11px] text-[#DC2626] dark:text-[#EF4444] flex items-center gap-1 pt-1 font-medium">
                        <span>● Otvorené opravy ({openRepairs.length})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => navigateTo("property-detail", apt.id)}
                    className="flex-1 py-2 px-3 text-xs font-medium rounded-lg text-white bg-[#004AAD] hover:bg-[#003B87] dark:bg-[#3B82F6] dark:text-[#0A0A0A] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Detail bytu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(apt.id, apt.name)}
                    className="p-2 text-neutral-400 hover:text-[#DC2626] dark:hover:text-[#EF4444] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Zmazať byt"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
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
