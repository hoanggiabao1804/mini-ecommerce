import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react()],
		server: {
			port: Number(env.BACKOFFICE_PORT || 5174),
			strictPort: true,
			proxy: {
				"/api": env.API_GATEWAY_URL || "http://localhost:3000",
			},
		},
	};
});
