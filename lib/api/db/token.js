import { ObjectId } from "mongodb"
import { nanoid } from "nanoid"
import { db } from "../middlewares"

export function findTokenByIdAndType(id, type) {
	return db.collection("tokens").findOne({
		_id: id,
		type
	})
}

export function findAndDeleteTokenByIdAndType(id, type) {
	return db
		.collection("tokens")
		.findOneAndDelete({ _id: id, type })
		.then(({ value }) => value)
}

export async function createToken({ creatorId, type, expireAt }) {
	const securedTokenId = nanoid(32)
	const token = {
		_id: securedTokenId,
		creatorId: ObjectId(creatorId),
		type,
		expireAt
	}
	await db.collection("tokens").insertOne(token)
	return token
}

export async function createUserToken({ creatorId, type, expireAt, role }) {
	const securedTokenId = nanoid(32)
	const token = {
		_id: securedTokenId,
		creatorId: ObjectId(creatorId),
		verified: true,
		role,
		type,
		expireAt
	}
	await db.collection("tokens").insertOne(token)
	return token
}
