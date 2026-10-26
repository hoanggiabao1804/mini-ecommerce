import { createProxyMiddleware } from "http-proxy-middleware";
import { ServerResponse } from "node:http";

type ProxyError = Error & {
	code?: string;
};

function createServiceProxy(
	target: string,
	serviceName: string,
	upstreamBasePath: string,
	proxyTimeoutMs = 5000,
) {
	return createProxyMiddleware({
		target,
		changeOrigin: true,
		proxyTimeout: proxyTimeoutMs,
		pathRewrite: (path) => {
			return `${upstreamBasePath}${path}`;
		},
		on: {
			error(error, request, response, proxyTarget) {
				const proxyError = error as ProxyError;

				console.error("[API Gateway] Proxy error", {
					service: serviceName,
					method: request.method,
					url: request.url,
					target: proxyTarget,
					code: proxyError.code,
					message: proxyError.message,
				});

				if (!(response instanceof ServerResponse)) {
					response.destroy(error);
					return;
				}

				if (response.headersSent) {
					response.destroy(error);
					return;
				}

				const isTimeout =
					proxyError.code === "ETIMEDOUT" ||
					proxyError.code === "ESOCKETTIMEDOUT";

				const statusCode = isTimeout ? 504 : 502;

				const body = JSON.stringify({
					message: isTimeout
						? `${serviceName} timed out`
						: `${serviceName} unavailable`,
				});

				response.writeHead(statusCode, {
					"content-type": "application/json; charset=utf-8",
					"content-length": Buffer.byteLength(body),
				});

				response.end(body);
			},
		},
	});
}

export { createServiceProxy };
