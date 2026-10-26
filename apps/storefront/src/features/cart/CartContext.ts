import { createContext } from "react";
import type { CartLine } from "./cart";
export type CartState = {
	lines: CartLine[];
	itemCount: number;
	total: number;
	addItem: (variantId: number, quantity: number) => void;
	setQuantity: (variantId: number, quantity: number) => void;
	completePurchase: (purchased: CartLine[]) => void;
	removeItem: (variantId: number) => void;
};
export const CartContext = createContext<CartState | null>(null);
