import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Circle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropertyCardData } from "./property-card-info";

interface PropertyHeroSectionProps {
  property: PropertyCardData;
}

export default function PropertyHeroSection({
  property,
}: PropertyHeroSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Image */}
      <Card className="md:col-span-1 relative h-48 w-full bg-muted overflow-hidden shadow-none border-none">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover rounded-xl"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Žiadny obrázok
          </div>
        )}
      </Card>

      {/* Info */}
      <Card className="md:col-span-2 shadow-none border-none">
        <CardHeader className="gap-1 p-0">
          <CardTitle className="md:text-2xl lg:text-4xl leading-tight">
            {property.title}
          </CardTitle>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {property.street}, {property.city}
            </span>
          </div>

          {/**State */}
          <div>
            <Badge
              variant="outline"
              className="text-green-500 border-green-200 bg-green-50 gap-1.5 shrink-0"
            >
              <Circle className="size-2 fill-green-500" />
              Aktívne / Obsadené
            </Badge>
          </div>
        </CardHeader>

        {/**Description */}
        {property.description && (
          <CardContent className="p-0 mt-2">
            <CardDescription>{property.description}</CardDescription>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
