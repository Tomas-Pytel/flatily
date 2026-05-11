import { PaymentStatus } from "./property";

export interface TenantInfo {
  name: string;
  leaseEndDate: string;
  paymentStatus: PaymentStatus;
  deposit: number;
  phone: string;
  email: string;
  image?: string;
}
