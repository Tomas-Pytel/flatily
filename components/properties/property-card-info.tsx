import { Property } from "@/types/property";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import Image from "next/image";
import { Building2, MapPin } from "lucide-react";

interface PropertyCardInfoProps {
  property: Property;
}

export function PropertyCardInfo({ property }: PropertyCardInfoProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:ring-1 hover:ring-primary/20 hover:shadow-lg group">
      {/**Image section */}
      <div className="relative aspect-video w-full bg-muted overflow-hidden">
        {property.img ? (
          <Image
            src={property.img}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground bg-muted/50 gap-2">
            <Building2 className="size-8 opacity-20" />
            <span className="text-xs font-medium">Žiadny obrázok</span>
          </div>
        )}
      </div>
      {/**Card Content */}
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        <CardTitle>{property.title}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {property.street}, {property.city}
          </span>
        </div>
        {property.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {property.description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
