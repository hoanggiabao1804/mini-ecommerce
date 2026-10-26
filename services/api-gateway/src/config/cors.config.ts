import { CorsOptions } from "cors";

const corsConfig: CorsOptions = {
	origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
	optionsSuccessStatus: 200,
};

export { corsConfig };
