import { findProduct } from "../catalog/catalog";
export const MAX_QUANTITY = 99;
export type CartLine = { productId: string; quantity: number };
export function addLine(
  lines: CartLine[],
  productId: string,
  quantity: number,
): CartLine[] {
  if (!findProduct(productId) || !Number.isInteger(quantity) || quantity < 1)
    return lines;
  const existing = lines.find((line) => line.productId === productId);
  if (existing)
    return lines.map((line) =>
      line.productId === productId
        ? {
            ...line,
            quantity: Math.min(MAX_QUANTITY, line.quantity + quantity),
          }
        : line,
    );
  return [...lines, { productId, quantity: Math.min(MAX_QUANTITY, quantity) }];
}
export function changeQuantity(
  lines: CartLine[],
  productId: string,
  quantity: number,
): CartLine[] {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY)
    return lines;
  return lines.map((line) =>
    line.productId === productId ? { ...line, quantity } : line,
  );
}
