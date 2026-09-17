import type { Product } from "../../types/product";
export type DeliveryInfo = {
  recipient: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  note: string;
};
export type CheckoutItem = { product: Product; quantity: number };
export type CheckoutSnapshot = {
  items: CheckoutItem[];
  delivery: DeliveryInfo;
  total: number;
};
export type DemoOutcome = "success" | "failure";
export type DemoReceipt = CheckoutSnapshot & {
  reference: string;
  outcome: DemoOutcome;
};
