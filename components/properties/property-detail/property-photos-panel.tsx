import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

import { EmptyPanel } from "./property-detail-cards";
import type { PropertyDetailProps } from "./property-detail-cards";

export default function PropertyPhotosPanel({ property }: PropertyDetailProps) {
  const photos = property.photoUrl
    ? [{ url: property.photoUrl, label: "Titulná fotografia" }]
    : [];

  if (photos.length === 0) {
    return (
      <EmptyPanel
        icon={ImageIcon}
        title="Titulná fotografia nie je dostupná"
        description="Ďalšie fotografie sa v tomto detaile zatiaľ nenačítavajú."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {photos.map((photo) => (
        <Card
          key={photo.url}
          className="group relative h-60 overflow-hidden rounded-xl shadow-none"
        >
          <Image
            src={photo.url}
            alt={`${property.title} – ${photo.label.toLowerCase()}`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            referrerPolicy="no-referrer"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[11px] text-white">
            {photo.label}
          </span>
        </Card>
      ))}
    </div>
  );
}
