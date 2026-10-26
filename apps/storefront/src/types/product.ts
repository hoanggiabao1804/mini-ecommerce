export type CategoryId = "phone" | "laptop" | "tablet" | "audio" | "watch";
// Mirrors the public ProductDto and ProductVariantDto returned by product-service.
export type ProductVariant = {
	id: number;
	sku: string;
	color: string;
	storage: string | null;
	ram: string | null;
	price: number;
	image: string;
};

export type Product = {
	id: number;
	slug: string;
	name: string;
	brand: string;
	category: CategoryId;
	specs: string[];
	badge: string | null;
	description: string;
	variants: ProductVariant[];
};

export type ProductListResponse = {
	data: Product[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
	};
};

export const formatPrice = (value: number) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);

export const variantLabel = (variant: ProductVariant) =>
	[variant.storage, variant.ram, variant.color].filter(Boolean).join(" · ");
