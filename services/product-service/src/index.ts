import { env } from "./config/env.js";
import { prisma } from "./libs/prisma.js";
import { createApp } from "./app.js";

const server = createApp(prisma).listen(env.port, () => {
	console.log(`Product service listening on ${env.port}`);
});

let closing = false;

async function shutdown() {
	if (closing) return;
	closing = true;

	server.close(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});

	setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
