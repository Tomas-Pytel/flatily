import {
  currencyFormatter,
  dateFormatter,
  DetailValue,
} from "./property-detail-cards";
import type { PropertyDetailProps } from "./property-detail-cards";

export default function PropertyOverviewPanel({
  property,
}: PropertyDetailProps) {
  const equipment: string[] = [];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Popis nehnuteľnosti
        </h2>
        <p className="max-w-3xl text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          {property.description?.trim() ||
            "Popis nehnuteľnosti nie je vyplnený."}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Technické parametre
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <DetailValue label="Úžitková plocha" value={`${property.area} m²`} />
          <DetailValue label="Počet izieb" value={String(property.rooms)} />
          <DetailValue
            label="Poschodie"
            value={`${property.floor} z ${property.totalFloors}`}
          />
          <DetailValue
            label="Výťah"
            value={property.hasElevator ? "Áno" : "Nie"}
          />
          <DetailValue
            label="Balkón / loggia"
            value={property.hasBalcony ? "Áno" : "Nie"}
          />
          <DetailValue
            label="Pivnica"
            value={property.hasCellar ? "Áno" : "Nie"}
          />
          <DetailValue
            label="Mesačné nájomné"
            value={currencyFormatter.format(property.monthlyRent)}
          />
          <DetailValue
            label="Záloha na energie a služby"
            value={currencyFormatter.format(property.utilitiesAmount)}
          />
          <DetailValue
            label="Kaucia"
            value={currencyFormatter.format(property.depositAmount)}
          />
          <DetailValue
            label="Zaradené do systému"
            value={dateFormatter.format(property.createdAt)}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Vybavenie a spotrebiče
        </h2>
        {equipment.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {equipment.map((item) => (
              <li
                key={item}
                className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:border-neutral-700/60 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Zoznam vybavenia sa v tomto detaile zatiaľ nenačítava.
          </p>
        )}
      </section>
    </div>
  );
}
