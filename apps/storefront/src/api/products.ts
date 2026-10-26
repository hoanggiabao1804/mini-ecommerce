import { api } from "./client";
import type { Product, ProductListResponse } from "../types/product";

export async function listProducts(page: number, signal?: AbortSignal) {
	const response = await api.get<ProductListResponse>("/products", {
		params: { page, limit: 50 },
		signal,
	});
	if (
		!Array.isArray(response.data.data) ||
		typeof response.data.meta?.totalPages !== "number"
	)
		throw new Error("Invalid product response");
	return response.data;
}

export async function getProduct(slug: string, signal?: AbortSignal) {
	const response = await api.get<Product>(
		`/products/${encodeURIComponent(slug)}`,
		{ signal },
	);
	return response.data;
}
