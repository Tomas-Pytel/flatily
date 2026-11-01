"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AlertTriangle, CreditCard, FileText, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PropertyDetail } from "@/types/property";

import PropertyOverviewPanel from "./property-overview-panel";
import PropertyPhotosPanel from "./property-photos-panel";
import PropertySummary from "./property-summary";
import PropertyTenantPanel from "./property-tenant-panel";
import { EmptyPanel } from "./property-detail-cards";

const detailTabs = [
  { id: "overview", label: "Prehľad" },
  { id: "tenant", label: "Nájomník" },
  { id: "payments", label: "Platby" },
  { id: "maintenance", label: "Opravy" },
  { id: "documents", label: "Dokumenty" },
  { id: "photos", label: "Fotografie" },
] as const;

type DetailTab = (typeof detailTabs)[number]["id"];

interface PropertyDetailContentProps {
  property: PropertyDetail;
}

export default function PropertyDetailContent({
  property,
}: PropertyDetailContentProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % detailTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + detailTabs.length) % detailTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = detailTabs.length - 1;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      setActiveTab(detailTabs[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <>
      <PropertySummary property={property} />

      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100 px-5 py-2.5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <span>
          Finančná analytika:{" "}
          <span className="italic">ROI zatiaľ nie je k dispozícii.</span>
        </span>
        <span className="hidden text-[11px] text-neutral-400 sm:inline">
          Evidencia Flatily
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Sekcie detailu nehnuteľnosti"
        className="flex overflow-x-auto border-b border-neutral-200 px-3 dark:border-neutral-800 sm:px-5"
      >
        {detailTabs.map((tab, index) => (
          <Button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`property-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="property-detail-panel"
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            variant="ghost"
            className={`h-auto rounded-none border-b-2 px-3.5 py-3 text-xs font-semibold transition-colors hover:bg-transparent dark:hover:bg-transparent ${
              activeTab === tab.id
                ? "border-primary text-primary dark:hover:text-primary"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div
        id="property-detail-panel"
        role="tabpanel"
        aria-labelledby={`property-tab-${activeTab}`}
        tabIndex={0}
        className="p-4 sm:p-6"
      >
        {activeTab === "overview" && (
          <PropertyOverviewPanel property={property} />
        )}
        {activeTab === "tenant" && <PropertyTenantPanel property={property} />}
        {activeTab === "payments" && (
          <EmptyPanel
            icon={CreditCard}
            title="Prehľad platieb nie je načítaný"
            description="Údaje o predpísaných platbách a prijatých úhradách sa v tomto detaile zatiaľ nezobrazujú."
          />
        )}
        {activeTab === "maintenance" && (
          <div className="space-y-4">
            {property.isProblematic && (
              <Card className="flex items-start gap-2 rounded-lg border-warning/30 bg-warning/10 p-3 text-xs text-warning shadow-none">
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>
                  Nehnuteľnosť je označená ako problematická. Podrobnosti o
                  opravách sa v tomto detaile nenačítavajú.
                </span>
              </Card>
            )}
            <EmptyPanel
              icon={Wrench}
              title="Záznamy o opravách nie sú načítané"
              description="História údržby a požiadaviek na opravu sa v tomto detaile zatiaľ nezobrazuje."
            />
          </div>
        )}
        {activeTab === "documents" && (
          <EmptyPanel
            icon={FileText}
            title="Dokumenty nie sú načítané"
            description="Dokumenty priradené k nehnuteľnosti sa v tomto detaile zatiaľ nezobrazujú."
          />
        )}
        {activeTab === "photos" && <PropertyPhotosPanel property={property} />}
      </div>
    </>
  );
}
