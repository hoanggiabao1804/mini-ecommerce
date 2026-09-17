import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3007);

app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({
    service: 'notification-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Resource not found' });
});

const server = app.listen(port, () => {
  console.log('notification-service listening on port ' + port);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
