import type { Property as PrismaProperty } from "@/lib/generated/prisma/client";

export type PaymentStatus = "Uhradené" | "Čakajúce" | "Omeškané";
export type PropertyStatus = "Aktívne" | "Neaktívne" | "V údržbe";
export type PropertyOccupancyStatus = "Voľný" | "Obsadený";

export type PropertyDetail = Omit<
  PrismaProperty,
  "monthlyRent" | "utilitiesAmount" | "depositAmount" | "area"
> & {
  monthlyRent: number;
  utilitiesAmount: number;
  depositAmount: number;
  area: number;
  photoUrl: string;
  status: PropertyOccupancyStatus;
};

export type PropertyListItem = {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  area: number;
  rooms: number;
  floor: number;
  totalFloors: number;
  rentAmount: number;
  utilitiesAmount: number;
  photoUrl: string | null;
  tenantName: string | null;
  status: "obsadeny" | "volny";
  paymentStatus: PaymentStatus | null;
  openRepairsCount: number;
};
