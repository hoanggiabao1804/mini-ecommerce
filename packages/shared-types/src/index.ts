export type HealthResponse = {
	service: string;
	status: "ok";
	timestamp?: string;
};

export type EventEnvelope<T> = {
	eventId: string;
	eventType: string;
	eventVersion: number;
	occurredAt: string;
	data: T;
};
