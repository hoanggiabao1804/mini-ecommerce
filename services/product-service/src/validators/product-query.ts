import type {
	CreateProductRequestDto,
	ProductQuery,
} from "../types/product.js";
import { BadRequest } from "../middlewares/error-handler.js";

function text(
	queries: Record<string, unknown>,
	key: string,
	max = 100,
): string | undefined {
	const value = queries[key];
	if (value === undefined) {
		return undefined;
	}

	if (typeof value !== "string" || value.length > max) {
		throw new BadRequest(`Invalid ${key}`);
	}

	return value.trim() || undefined;
}

function integer(
	input: Record<string, unknown>,
	key: string,
	fallback: number,
	max: number = Math.pow(2, 31) - 1,
): number {
	if (input[key] === undefined) {
		return fallback;
	}

	const value = text(input, key);
	if (!value || !/^[1-9]\d*$/.test(value) || Number(value) > max) {
		throw new BadRequest(`${key} must be an integer from 1 to ${max}`);
	}

	return Number(value);
}

function blank(value: string) {
	if (!value || value.trim().length === 0) {
		return true;
	}

	return false;
}

function parseProductQuery(input: Record<string, unknown>): ProductQuery {
	const allowedQueries = [
		"page",
		"limit",
		"category",
		"brand",
		"search",
		"sort",
	];
	const allowedCategories = ["phone", "laptop", "tablet", "audio", "watch"];

	for (const key of Object.keys(input)) {
		if (!allowedQueries.includes(key)) {
			throw new BadRequest(`Unknown query parameter: ${key}`);
		}
	}

	const category = text(input, "category");

	if (category && !allowedCategories.includes(category)) {
		throw new BadRequest("Invalid category");
	}

	const sort = text(input, "sort") ?? "featured";
	if (sort !== "featured" && sort !== "asc" && sort !== "desc") {
		throw new BadRequest("Invalid sort");
	}

	return {
		page: integer(input, "page", 1, 100000),
		limit: integer(input, "limit", 8, 50),
		category,
		brand: text(input, "brand"),
		search: text(input, "search", 200),
		sort,
	};
}

function parseRelatedProductsQuery(input: Record<string, unknown>) {
	const allowedQueries = ["limit", "id"];

	for (const key of Object.keys(input)) {
		if (!allowedQueries.includes(key)) {
			throw new BadRequest(`Unknown query parameter: ${key}`);
		}
	}

	return {
		limit: integer(input, "limit", 4, 50),
		id: integer(input, "id", 0),
	};
}

function validateCreateProductRequest(
	input: CreateProductRequestDto,
): CreateProductRequestDto {
	if (!input) {
		throw new BadRequest("Request body is required");
	}

	let { slug, name, brand, category, specs, badge, description, variants } =
		input;

	if (
		blank(slug) ||
		blank(name) ||
		blank(brand) ||
		blank(category) ||
		!specs ||
		blank(description) ||
		!variants
	) {
		throw new BadRequest(
			"Product's slug, name, brand, category, specifications, description and varians are required",
		);
	}

	slug = slug.trim();
	name = name.trim();
	brand = brand.trim();
	category = category.trim();
	description = description.trim();

	const allowedCategories = ["phone", "laptop", "tablet", "audio", "watch"];

	if (!allowedCategories.includes(category)) {
		throw new BadRequest("Invalid category");
	}

	if (variants.length === 0) {
		throw new BadRequest("Product must has at least 1 variant");
	}

	variants.forEach((variant) => {
		if (
			blank(variant.sku) ||
			blank(variant.color) ||
			!variant.price ||
			blank(variant.image)
		) {
			throw new BadRequest(
				"Product's variant attributes (sku, color, price, image) are required and cannot be blank",
			);
		}

		variant.sku = variant.sku.trim();
		variant.color = variant.color.trim();
		variant.image = variant.image.trim();

		if (variant.price < 0) {
			throw new BadRequest("Product variant's price must be positive");
		}
	});

	return {
		slug: slug,
		name: name,
		brand: brand,
		category: category,
		specs: specs,
		badge: badge ? badge.trim() : undefined,
		description: description,
		variants: variants,
	};
}

export {
	parseProductQuery,
	parseRelatedProductsQuery,
	validateCreateProductRequest,
};
