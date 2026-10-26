export type Category = "phone" | "laptop" | "tablet" | "audio" | "watch";

export type ProductDto = {
	id: number;
	slug: string;
	name: string;
	brand: string;
	category: Category;
	specs: string[];
	badge: string | null;
	description: string;
	variants: ProductVariantDto[];
};

export type ProductVariantDto = {
	id: number;
	sku: string;
	color: string;
	storage: string | null;
	ram: string | null;
	price: number;
	image: string;
};

export type ProductQuery = {
	page: number;
	limit: number;
	search?: string;
	category?: string;
	brand?: string;
	sort: "featured" | "asc" | "desc";
};

export type RelatedProductsQuery = {
	limit: number;
	id: number;
};

export type CreateProductRequestDto = {
	slug: string;
	name: string;
	brand: string;
	category: string;
	specs: string[];
	badge?: string;
	description: string;
	variants: {
		sku: string;
		color: string;
		storage?: string;
		ram?: string;
		price: number;
		image: string;
	}[];
};

export type UpdateVariantDto = {
	id: number;
	sku?: string;
	color?: string;
	storage?: string | null;
	ram?: string | null;
	price?: number;
	image?: string;
	isActive?: boolean;
	displayOrder?: number;
};

export type CreateVariantDto = {
	id?: never;
	sku: string;
	color: string;
	storage?: string | null;
	ram?: string | null;
	price: number;
	image: string;
	isActive?: boolean;
	displayOrder?: number;
};

/** PATCH semantics: omitted fields and variants are left unchanged. */
export type UpdateProductRequestDto = {
	id: number;
	slug?: string;
	name?: string;
	brand?: string;
	category?: Category;
	specs?: string[];
	badge?: string | null;
	description?: string;
	variants?: (UpdateVariantDto | CreateVariantDto)[];
};

export type Meta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
};

export type ResultPagination<T> = {
	meta: Meta;
	data: T;
};
