import { Router } from "express";
import type { ProductService } from "../services/product.service.js";
import {
	createNewProduct,
	updateProduct,
	fetchProductBySlug,
	fetchRelatedProducts,
	listProducts,
} from "../controllers/product.controller.js";

function productRoutes(service: ProductService) {
	const router = Router();
	router.get("/", listProducts(service));
	router.get("/:slug", fetchProductBySlug(service));
	router.get("/:id/related", fetchRelatedProducts(service));
	router.post("/", createNewProduct(service));
	router.patch("/:id", updateProduct(service));
	return router;
}

export { productRoutes };
