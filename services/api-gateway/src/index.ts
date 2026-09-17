import "dotenv/config";
import cors from "cors";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
	}),
);

app.get("/health", (_request, response) => {
	response.json({ service: "api-gateway", status: "ok" });
});

const routes = [
	["/api/auth", process.env.AUTH_SERVICE_URL ?? "http://localhost:3001"],
	[
		"/api/products",
		process.env.PRODUCT_SERVICE_URL ?? "http://localhost:3002",
	],
	["/api/cart", process.env.CART_SERVICE_URL ?? "http://localhost:3003"],
	["/api/orders", process.env.ORDER_SERVICE_URL ?? "http://localhost:3004"],
	[
		"/api/notifications",
		process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:3007",
	],
] as const;

for (const [path, target] of routes) {
	app.use(
		path,
		createProxyMiddleware({
			target,
			changeOrigin: true,
		}),
	);
}

app.use((_request, response) => {
	response.status(404).json({ message: "Resource not found" });
});

const server = app.listen(port, () => {
	console.log(`API Gateway listening on port ${port}`);
});

function shutdown() {
	server.close(() => process.exit(0));
	setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
