import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["test/integration/**/*.integration.test.ts"],

		fileParallelism: false,

		hookTimeout: 60_000,

		testTimeout: 30_000,
	},
});
