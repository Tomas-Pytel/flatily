"use client";
import { Badge } from "@/components/ui/badge";
import type { PropertyDetail, PropertyOccupancyStatus } from "@/types/property";
import {
  Building2,
  CheckCircle2,
  FilePlus,
  LucideIcon,
  MapPin,
  TriangleAlertIcon,
  Wrench,
} from "lucide-react";
import { DeletePropertyButton } from "../delete-property-button";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BadgeStatus } from "../extended-property-card";

const occupancyStatusToBadge: Record<
  PropertyOccupancyStatus,
  {
    variant: BadgeStatus;
    icon: LucideIcon;
  }
> = {
  Obsadený: {
    variant: "success",
    icon: CheckCircle2,
  },
  Voľný: {
    variant: "warning",
    icon: TriangleAlertIcon,
  },
};

interface PropertyHeaderProps {
  property: PropertyDetail;
}

export default function PropertyHeader({
  property,
}: PropertyHeaderProps) {
  const StatusIcon = property.status
    ? occupancyStatusToBadge[property.status].icon
    : null;

  return (
    <div className="relative h-64 sm:h-72 w-full bg-neutral-900 overflow-hidden">
      {property.photoUrl ? (
        <Image
          src={property.photoUrl}
          alt={property.title}
          fill
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50 text-muted">
          <Building2 className="size-8 opacity-90" />
          <span className="text-xs font-medium">Žiadny obrázok</span>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

      {/* Overlay info */}
      <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant={occupancyStatusToBadge[property.status].variant}
              className="gap-1.5 border-0 font-medium px-2 py-0.5"
            >
              {StatusIcon && <StatusIcon className="size-3" />}
              {property.status}
            </Badge>
            <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full tabular-nums">
              {Number(property.area)} m² · {property.rooms} izbový · Poschodie{" "}
              {property.floor}/{property.totalFloors}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {property.title}
          </h1>
          <div className="flex items-center gap-1 text-xs text-neutral-300 mt-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>
              {property.street}, {property.postalCode} {property.city} –{" "}
              {property.district}
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Pridať opravu</span>
          </Button>

          <Button
            variant="secondary"
            className="cursor-pointer bg-white/90 text-neutral-800 hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Pridať dokument</span>
          </Button>
          <DeletePropertyButton
            propertyId={property.id}
            propertyName={property.title}
            className="bg-black/40 text-neutral-300 hover:bg-black/60 hover:text-[#DC2626] dark:hover:text-[#EF4444]"
          />
        </div>
      </div>
    </div>
  );
}
