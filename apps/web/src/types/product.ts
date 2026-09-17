export type CategoryId = "phone" | "laptop" | "tablet" | "audio" | "watch";
export type Product = {
	id: string;
	/** Group explicitly related SKUs; each SKU owns its specs, image and price. */
	variantGroup?: string;
	name: string;
	brand: string;
	category: CategoryId;
	image: string;
	price: number;
	specs: string[];
	color: string;
	badge?: string;
	description: string;
};
export const formatPrice = (value: number) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);
