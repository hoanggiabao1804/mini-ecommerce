import "dotenv/config";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
	throw new Error("Invalid PORT");
}

const server = createApp().listen(port, () =>
	console.log(`API Gateway listening on port ${port}`),
);

function shutdown() {
	server.close(() => process.exit(0));
	setTimeout(() => process.exit(1), 10000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
