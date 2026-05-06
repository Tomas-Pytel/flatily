import { Property } from "@/features/dashboard/types/types";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import Image from "next/image";

interface PropertyCardInfoProps {
  property: Property;
}

export function PropertyCardInfo({ property }: PropertyCardInfoProps) {
  return (
    <Card className="overflow-hidden">
      {
        property.img && (
          <Image
            src={property.img}
            alt={property.title}
            width={400}
            height={300}
            className="object-cover"
          />
        ) //otherwise display a placeholder image
      }

      <CardContent className="p-6">
        <CardTitle>{property.title}</CardTitle>
        <div className="bg-green-600">
          <p>{property.city}</p>
          <p>{property.street}</p>
        </div>
      </CardContent>
      {property.description && (
        <CardDescription>{property.description}</CardDescription>
      )}
    </Card>
  );
}
