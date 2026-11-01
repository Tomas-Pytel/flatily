import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  UserRound,
} from "lucide-react";

import { SummaryCard, currencyFormatter } from "./property-detail-cards";
import type { PropertyDetailProps } from "./property-detail-cards";

export default function PropertySummary({ property }: PropertyDetailProps) {
  return (
    <section
      aria-label="Súhrn nehnuteľnosti"
      className="grid grid-cols-1 gap-3 border-b border-neutral-200 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40 sm:grid-cols-2 sm:p-5 xl:grid-cols-4"
    >
      <SummaryCard
        label="Mesačné nájomné"
        value={currencyFormatter.format(property.monthlyRent)}
        description={`Energie a služby: ${currencyFormatter.format(property.utilitiesAmount)} · Kaucia: ${currencyFormatter.format(property.depositAmount)}`}
        icon={CreditCard}
      />
      <SummaryCard
        label="Obsadenosť"
        value={property.status}
        description="Podľa aktuálne evidovanej nájomnej zmluvy"
        icon={UserRound}
      />
      <SummaryCard
        label="Platby"
        value="Nenačítané"
        description="Prehľad platieb sa v tomto detaile zatiaľ nezobrazuje."
        icon={CalendarDays}
      />
      <SummaryCard
        label="Stav nehnuteľnosti"
        value={
          property.isProblematic ? "Vyžaduje pozornosť" : "Bez upozornenia"
        }
        description="Stav evidovaný pri nehnuteľnosti"
        icon={property.isProblematic ? AlertTriangle : CheckCircle2}
      />
    </section>
  );
}
