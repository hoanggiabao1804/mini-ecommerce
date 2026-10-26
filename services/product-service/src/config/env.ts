import "dotenv/config";

const port = Number(process.env.PORT ?? 3002);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
	throw new Error("Invalid PORT");
}

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is required");
}

export const env = { port, databaseUrl: process.env.DATABASE_URL };
