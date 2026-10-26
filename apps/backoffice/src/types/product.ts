export type Category = "phone" | "laptop" | "tablet" | "audio" | "watch";

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
	category: Category;
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

export const categoryLabels: Record<Category, string> = {
	phone: "Điện thoại",
	laptop: "Laptop",
	tablet: "Máy tính bảng",
	audio: "Âm thanh",
	watch: "Đồng hồ",
};

export const formatPrice = (price: number) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(price);
