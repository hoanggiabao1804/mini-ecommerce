import { useState, type ReactNode } from "react";
import { CartContext } from "./CartContext";
import { addLine, changeQuantity, type CartLine } from "./cart";
import { findProduct } from "../catalog/catalog";
export default function CartProvider({ children }: { children: ReactNode }) {
  // A tab-scoped demo basket, usable before login. No backend or browser storage.
  const [lines, setLines] = useState<CartLine[]>([]);
  const value = {
    lines,
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
    total: lines.reduce(
      (total, line) =>
        total + (findProduct(line.productId)?.price ?? 0) * line.quantity,
      0,
    ),
    addItem: (id: string, quantity: number) =>
      setLines((current) => addLine(current, id, quantity)),
    setQuantity: (id: string, quantity: number) =>
      setLines((current) => changeQuantity(current, id, quantity)),
    completePurchase: (purchased: CartLine[]) =>
      setLines((current) =>
        current.flatMap((line) => {
          const paid =
            purchased.find((item) => item.productId === line.productId)
              ?.quantity ?? 0;
          const remaining = line.quantity - paid;
          return remaining > 0 ? [{ ...line, quantity: remaining }] : [];
        }),
      ),
    removeItem: (id: string) =>
      setLines((current) => current.filter((line) => line.productId !== id)),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
