import { Property } from "@/types/property";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface PropertyCardInfoProps {
  property: Property;
}

export function PropertyCardInfo({ property }: PropertyCardInfoProps) {
  return (
    <Card className="overflow-hidden w-full h-full">
      <div className="relative h-48 w-full bg-muted">
        {property.img ? (
          <Image
            src={property.img}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Žiadny obrázok
          </div>
        )}
      </div>
      {/**Card Content */}
      <CardContent className="p-6">
        <CardTitle>{property.title}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {property.street}, {property.city}
          </span>
        </div>
        {property.description && (
          <CardDescription>{property.description}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
