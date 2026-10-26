import type { RequestHandler } from "express";
import type { ProductService } from "../services/product.service.js";
import {
	parseProductQuery,
	parseRelatedProductsQuery,
	validateCreateProductRequest,
} from "../validators/product-query.js";
import { parseProductId as parseId, validateUpdateProductRequest as validateUpdate } from "../validators/update-product.js";
import { CreateProductRequestDto } from "../types/product.js";

function listProducts(service: ProductService): RequestHandler {
	return async (request, response) => {
		response.json(await service.list(parseProductQuery(request.query)));
	};
}

function fetchProductBySlug(service: ProductService): RequestHandler {
	return async (request, response) => {
		response.json(await service.findBySlug(request.params.slug as string));
	};
}

function fetchRelatedProducts(service: ProductService): RequestHandler {
	return async (request, response) => {
		response.json(
			await service.findRelatedProducts(
				parseRelatedProductsQuery({
					...request.query,
					...request.params,
				}),
			),
		);
	};
}

function createNewProduct(service: ProductService): RequestHandler {
	return async (request, response) => {
		const createRequest: CreateProductRequestDto = request.body;
		response
			.status(201)
			.json(
				await service.create(
					validateCreateProductRequest(createRequest),
				),
			);
	};
}

function updateProduct(service: ProductService): RequestHandler {
	return async (request, response) => {
		const id = parseId(request.params.id);
		response.json(await service.update(validateUpdate(id, request.body)));
	};
}

export {
	listProducts,
	fetchProductBySlug,
	fetchRelatedProducts,
	createNewProduct,
	updateProduct,
};
