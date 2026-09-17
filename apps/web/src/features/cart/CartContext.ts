import { createContext } from "react";
import type { CartLine } from "./cart";
export type CartState = {
  lines: CartLine[];
  itemCount: number;
  total: number;
  addItem: (productId: string, quantity: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  completePurchase: (purchased: CartLine[]) => void;
  removeItem: (productId: string) => void;
};
export const CartContext = createContext<CartState | null>(null);
