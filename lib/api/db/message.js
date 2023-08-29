import { ObjectId } from "mongodb"
import { db } from "../middlewares"

export async function addMessage({ from, to, content }) {
	const message = {
		from,
		to,
		content,
		createdAt: new Date()
	}

	const { insertedId } = await db.collection("messages").insertOne(message)
	return insertedId
}

export async function getMessages(limit, from, to) {
	return await db
		.collection("messages")
		.aggregate([
			{
				$match: {
					from: ObjectId(from),
					to: ObjectId(to)
				}
			},
			{
				$limit: limit
			}
		])
		.toArray()
}
