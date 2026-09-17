import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const services = {
	"api-gateway": 3000,
	"auth-service": 3001,
	"product-service": 3002,
	"cart-service": 3003,
	"order-service": 3004,
	"inventory-service": 3005,
	"payment-service": 3006,
	"notification-service": 3007,
};

for (const [name, port] of Object.entries(services)) {
	const dir = `services/${name}`;

	if (existsSync(dir)) {
		console.log(`Skip existing directory: ${dir}`);
		continue;
	}

	for (const folder of ["config", "routes"]) {
		mkdirSync(`${dir}/src/${folder}`, { recursive: true });
	}

	writeFileSync(
		`${dir}/package.json`,
		JSON.stringify(
			{
				name: `@mini-ecommerce/${name}`,
				version: "0.1.0",
				private: true,
				type: "module",
				scripts: {
					dev: "tsx watch src/index.ts",
					build: "tsc -p tsconfig.json",
					start: "node dist/index.js",
					typecheck: "tsc -p tsconfig.json --noEmit",
				},
			},
			null,
			2,
		) + "\n",
	);

	writeFileSync(
		`${dir}/tsconfig.json`,
		JSON.stringify(
			{
				extends: "../../tsconfig.base.json",
				compilerOptions: {
					rootDir: "src",
					outDir: "dist",
				},
				include: ["src/**/*.ts"],
			},
			null,
			2,
		) + "\n",
	);

	writeFileSync(
		`${dir}/.env.example`,
		`NODE_ENV=development\nPORT=${port}\n`,
	);

	writeFileSync(
		`${dir}/src/index.ts`,
		`import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? ${port});

app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({
    service: '${name}',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Resource not found' });
});

const server = app.listen(port, () => {
  console.log('${name} listening on port ' + port);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
`,
	);

	console.log(`Created ${name}`);
}
