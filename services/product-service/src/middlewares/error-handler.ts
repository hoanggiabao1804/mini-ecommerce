import type { ErrorRequestHandler } from "express";

class BadRequest extends Error {}

class Unauthorized extends Error {}

class NotFound extends Error {}

class Conflict extends Error {}

const errorHandler: ErrorRequestHandler = (
	error,
	_request,
	response,
	_next,
) => {
	if (error instanceof BadRequest) {
		response.status(400).json({ error: error.message });
		return;
	}

	if (error instanceof Unauthorized) {
		response.status(401).json({ error: error.message });
		return;
	}

	if (error instanceof NotFound) {
		response.status(404).json({ error: error.message });
		return;
	}

	if (error instanceof Conflict) {
		response.status(409).json({ error: error.message });
		return;
	}

	if (error instanceof Error) {
		console.error("Product request failed", {
			name: error.name,
			message: error.message,
			stack: error.stack,
		});
	} else {
		console.error("Product request failed", error);
	}
	response.status(500).json({ error: "Unable to handle request" });
};

export { BadRequest, Unauthorized, NotFound, Conflict, errorHandler };
