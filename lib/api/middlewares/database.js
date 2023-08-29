import { MongoClient } from "mongodb"
import { addSuperAdmin, findUserByEmail } from "../db"

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 * https://github.com/vercel/next.js/pull/17666
 */
global.mongo = global.mongo || {}
export let db

let indexesCreated = false
let superAdminCreated = false

async function createIndexes() {
	await Promise.all([
		db
			.collection("tokens")
			.createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
		db.collection("users").createIndexes([
			{ key: { email: 1 }, unique: true }
			//{ key: { username: 1 }, unique: true }
		])
	])
	indexesCreated = true
}

async function createSuperAdmin() {
	const user = await findUserByEmail(process.env.SEED_ADMIN_EMAIL)
	if (!user) {
		await addSuperAdmin()
		superAdminCreated = true
	}
}

export async function getMongoClient() {
	if (!global.mongo.client) {
		global.mongo.client = new MongoClient(process.env.MONGODB_URI)
	}
	// It is okay to call connect() even if it is connected
	// using node-mongodb-native v4 (it will be no-op)
	// See: https://github.com/mongodb/node-mongodb-native/blob/4.0/docs/CHANGES_4.0.0.md
	await global.mongo.client.connect()
	return global.mongo.client
}

export default async function database(req, res, next) {
	const dbClient = await getMongoClient()
	if (!db) db = dbClient.db(process.env.DB_NAME)
	if (!indexesCreated) await createIndexes(req.db)
	if (!superAdminCreated) await createSuperAdmin()
	return await next()
}
