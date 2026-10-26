import express from "express";
import type { Pool } from "pg";
import { ProductService } from "./services/product.service.js";
import { productRoutes } from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { PrismaClient } from "./generated/prisma/client.js";

function createApp(prisma: PrismaClient) {
	const app = express();

	app.disable("x-powered-by");

	app.use(express.json());

	app.get("/health", (_request, response) =>
		response.json({ service: "product-service", status: "ok" }),
	);

	app.use("/products", productRoutes(new ProductService(prisma)));

	app.use((_request, response) => {
		const protocol = _request.protocol;
		const host = _request.hostname;
		const url = _request.originalUrl;
		const port = process.env.PORT;

		const fullUrl = `${protocol}://${host}:${port}${url}`;

		const responseString = `Full URL is: ${fullUrl}`;
		console.log(responseString);
		response.status(404).json({ message: "Resource not found" });
	});

	app.use(errorHandler);

	return app;
}

export { createApp };
