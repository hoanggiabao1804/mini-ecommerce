import { api } from "./client";
import type { Category, ProductListResponse } from "../types/product";

export type ProductFilters = {
	page?: number;
	limit?: number;
	search?: string;
	category?: Category | "";
};

export async function listProducts(
	filters: ProductFilters = {},
	signal?: AbortSignal,
) {
	const response = await api.get<ProductListResponse>("/products", {
		params: {
			page: filters.page ?? 1,
			limit: filters.limit ?? 10,
			...(filters.search ? { search: filters.search } : {}),
			...(filters.category ? { category: filters.category } : {}),
		},
		signal,
	});
	if (
		!Array.isArray(response.data.data) ||
		typeof response.data.meta?.total !== "number"
	) {
		throw new Error("Invalid product response");
	}
	return response.data;
}
