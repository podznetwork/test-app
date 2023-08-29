import { ObjectId } from "mongodb"
import { db } from "../middlewares"
import { deleteObjectS3 } from "../s3/utils"

export async function getAllMediaZ() {
	return await db.collection("mediaz").find({}).toArray()
}

export async function getMediaZ(podcastId) {
	return await db
		.collection("mediaz")
		.find({
			podcast: new ObjectId(podcastId)
		})
		.sort({
			createdAt: -1
		})
		.toArray()
}

export async function deleteMediaZ(id) {
	const media = await db.collection("mediaz").findOne({
		_id: new ObjectId(id)
	})

	await deleteObjectS3(media.s3path)

	const { deletedCount } = await db.collection("mediaz").deleteOne({
		_id: new ObjectId(id)
	})

	return deletedCount
}
