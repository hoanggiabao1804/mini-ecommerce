import { CorsOptions } from "cors";

const origins = (
	process.env.CLIENT_ORIGINS ?? "http://localhost:5173,http://localhost:5174"
)
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsConfig: CorsOptions = {
	origin: origins,
	optionsSuccessStatus: 200,
};

export { corsConfig };
