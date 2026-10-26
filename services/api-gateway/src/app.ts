import cors from "cors";
import express from "express";
import { corsConfig } from "./config/cors.config.js";
import { createServiceProxy } from "./config/service-proxy.js";

function createApp() {
	const app = express();

	app.disable("x-powered-by");
	app.use(cors(corsConfig));

	app.get("/health", (_request, response) =>
		response.json({ service: "api-gateway", status: "ok" }),
	);

	const routes = [
		[
			"Auth Service",
			"/api/auth",
			process.env.AUTH_SERVICE_URL ?? "http://localhost:3001",
			"/auth",
		],
		[
			"Product Service",
			"/api/products",
			process.env.PRODUCT_SERVICE_URL ?? "http://localhost:3002",
			"/products",
		],
		[
			"Cart Service",
			"/api/cart",
			process.env.CART_SERVICE_URL ?? "http://localhost:3003",
			"/cart",
		],
		[
			"Order Service",
			"/api/orders",
			process.env.ORDER_SERVICE_URL ?? "http://localhost:3004",
			"/orders",
		],
		[
			"Notification Service",
			"/api/notifications",
			process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3007",
			"/notifications",
		],
	] as const;

	for (const [name, path, target, upstreamPath] of routes) {
		app.use(path, createServiceProxy(target, name, upstreamPath));
	}

	app.use((_request, response) => {
		response.status(404).json({ message: "Resource not found" });
	});

	return app;
}

export { createApp };
