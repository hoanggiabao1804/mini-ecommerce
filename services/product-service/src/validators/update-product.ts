import { BadRequest } from "../middlewares/error-handler.js";
import type {
	CreateVariantDto,
	UpdateProductRequestDto,
	UpdateVariantDto,
} from "../types/product.js";

const productFields = new Set([
	"slug", "name", "brand", "category", "specs", "badge", "description", "variants",
]);
const variantFields = new Set([
	"id", "sku", "color", "storage", "ram", "price", "image", "isActive", "displayOrder",
]);
const categories = new Set(["phone", "laptop", "tablet", "audio", "watch"]);

function record(value: unknown, label: string): Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new BadRequest(`${label} must be an object`);
	}
	return value as Record<string, unknown>;
}

function rejectUnknown(value: Record<string, unknown>, allowed: Set<string>) {
	for (const key of Object.keys(value)) {
		if (!allowed.has(key)) throw new BadRequest(`Unknown field: ${key}`);
	}
}

function positiveId(value: unknown, label: string): number {
	if (!Number.isSafeInteger(value) || (value as number) < 1 || (value as number) > 2_147_483_647) {
		throw new BadRequest(`${label} must be a positive integer`);
	}
	return value as number;
}

function text(value: unknown, label: string): string {
	if (typeof value !== "string" || !value.trim() || value.length > 500) {
		throw new BadRequest(`${label} must be a non-empty string`);
	}
	return value.trim();
}

function optionalText(value: unknown, label: string): string | null {
	return value === null ? null : text(value, label);
}

function price(value: unknown): number {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0 || value >= 1_000_000_000_000_000) {
		throw new BadRequest("price must be a positive integer within NUMERIC(15,0)");
	}
	return value;
}

function displayOrder(value: unknown): number {
	if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > 2_147_483_647) {
		throw new BadRequest("displayOrder must be a non-negative integer");
	}
	return value as number;
}

export function parseProductId(raw: unknown): number {
	const value = typeof raw === "string" && /^[1-9]\d*$/.test(raw) ? Number(raw) : NaN;
	return positiveId(value, "Product id");
}

export function validateUpdateProductRequest(
	id: number,
	body: unknown,
): UpdateProductRequestDto {
	positiveId(id, "Product id");
	const input = record(body, "Request body");
	rejectUnknown(input, productFields);
	if (!Object.keys(input).length) throw new BadRequest("At least one field is required");

	const output: UpdateProductRequestDto = { id };
	for (const field of ["slug", "name", "brand", "description"] as const) {
		if (field in input) output[field] = text(input[field], field);
	}
	if ("category" in input) {
		const category = text(input.category, "category");
		if (!categories.has(category)) throw new BadRequest("Invalid category");
		output.category = category as UpdateProductRequestDto["category"];
	}
	if ("specs" in input) {
		if (!Array.isArray(input.specs) || !input.specs.every((item) => typeof item === "string" && !!item.trim())) {
			throw new BadRequest("specs must be an array of non-empty strings");
		}
		output.specs = input.specs.map((item: string) => item.trim());
	}
	if ("badge" in input) output.badge = optionalText(input.badge, "badge");

	if ("variants" in input) {
		if (!Array.isArray(input.variants) || !input.variants.length) {
			throw new BadRequest("variants must be a non-empty array");
		}
		const ids = new Set<number>();
		const skus = new Set<string>();
		output.variants = input.variants.map((raw, index) => {
			const variant = record(raw, `variants[${index}]`);
			rejectUnknown(variant, variantFields);
			const hasId = "id" in variant;
			if (hasId) {
				const variantId = positiveId(variant.id, `variants[${index}].id`);
				if (ids.has(variantId)) throw new BadRequest("Duplicate variant id in request");
				ids.add(variantId);
				if (Object.keys(variant).length === 1) throw new BadRequest("Variant update has no changes");
			} else {
				for (const field of ["sku", "color", "price", "image"]) {
					if (!(field in variant)) throw new BadRequest(`New variant requires ${field}`);
				}
			}
			const parsed: Record<string, unknown> = hasId ? { id: variant.id } : {};
			for (const field of ["sku", "color", "image"] as const) {
				if (field in variant) parsed[field] = text(variant[field], field);
			}
			for (const field of ["storage", "ram"] as const) {
				if (field in variant) parsed[field] = optionalText(variant[field], field);
			}
			if ("price" in variant) parsed.price = price(variant.price);
			if ("isActive" in variant) {
				if (typeof variant.isActive !== "boolean") throw new BadRequest("isActive must be a boolean");
				parsed.isActive = variant.isActive;
			}
			if ("displayOrder" in variant) parsed.displayOrder = displayOrder(variant.displayOrder);
			if (typeof parsed.sku === "string") {
				if (skus.has(parsed.sku)) throw new BadRequest("Duplicate SKU in request");
				skus.add(parsed.sku);
			}
			return parsed as UpdateVariantDto | CreateVariantDto;
		});
	}
	return output;
}
