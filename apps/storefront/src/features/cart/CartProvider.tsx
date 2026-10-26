import { useState, type ReactNode } from "react";
import { CartContext } from "./CartContext";
import { addLine, changeQuantity, type CartLine } from "./cart";
import { useCatalog } from "../catalog/useCatalog";
export default function CartProvider({ children }: { children: ReactNode }) {
	// A tab-scoped demo basket, usable before login. No backend or browser storage.
	const {findVariant}=useCatalog();
	const [lines, setLines] = useState<CartLine[]>([]);
	const value = {
		lines,
		itemCount: lines.reduce((total, line) => total + line.quantity, 0),
		total: lines.reduce(
			(total, line) =>
				total +
				(findVariant(line.variantId)?.variant.price ?? 0) * line.quantity,
			0,
		),
		addItem: (variantId: number, quantity: number) =>
			setLines((current) => addLine(current, variantId, quantity)),
		setQuantity: (variantId: number, quantity: number) =>
			setLines((current) => changeQuantity(current, variantId, quantity)),
		completePurchase: (purchased: CartLine[]) =>
			setLines((current) =>
				current.flatMap((line) => {
					const paid =
						purchased.find(
							(item) => item.variantId === line.variantId,
						)?.quantity ?? 0;
					const remaining = line.quantity - paid;
					return remaining > 0
						? [{ ...line, quantity: remaining }]
						: [];
				}),
			),
		removeItem: (variantId: number) =>
			setLines((current) =>
				current.filter((line) => line.variantId !== variantId),
			),
	};
	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	);
}
