const databaseName = process.env.MONGO_INITDB_DATABASE;
const username = process.env.MONGO_NOTIFICATION_USERNAME;
const password = process.env.MONGO_NOTIFICATION_PASSWORD;

if (!databaseName || !username || !password) {
	throw new Error("Missing MongoDB notification initialization variables");
}

const notificationDb = db.getSiblingDB(databaseName);

if (!notificationDb.getUser(username)) {
	notificationDb.createUser({
		user: username,
		pwd: password,
		roles: [
			{
				role: "readWrite",
				db: databaseName,
			},
		],
	});

	print(`Created user ${username} for ${databaseName}`);
} else {
	print(`User ${username} already exists; no changes applied`);
}
