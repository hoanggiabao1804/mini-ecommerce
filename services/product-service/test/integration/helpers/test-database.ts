import {
	PostgreSqlContainer,
	type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../src/generated/prisma/client.js";

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type IntegrationDatabase = {
	container: StartedPostgreSqlContainer;
	prisma: PrismaClient;
	databaseUrl: string;
};

async function createIntegrationDatabase(): Promise<IntegrationDatabase> {
	const container = await new PostgreSqlContainer("postgres:16.15")
		.withDatabase("product_test")
		.withUsername("test")
		.withPassword("test")
		.start();

	const databaseUrl = container.getConnectionUri();

	await execFileAsync(
		"npx",
		["prisma", "migrate", "deploy", "--config", "prisma7.config.ts"],
		{
			cwd: process.cwd(),
			env: {
				...process.env,
				DATABASE_URL: databaseUrl,
			},
		},
	);

	const adapter = new PrismaPg({
		connectionString: databaseUrl,
	});

	const prisma = new PrismaClient({ adapter });

	return {
		container,
		prisma,
		databaseUrl,
	};
}

async function destroyIntegrationDatabase(database: IntegrationDatabase) {
	await database.prisma.$disconnect();

	await database.container.stop();
}

export {
	IntegrationDatabase,
	createIntegrationDatabase,
	destroyIntegrationDatabase,
};
