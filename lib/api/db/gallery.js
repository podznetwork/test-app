import { db } from "../middlewares"
import { ObjectId } from "mongodb"

export async function addGalleryImage({
	// creatorId,
	name,
	description,
	sponsored,
	path,
	url
}) {
	const image = {
		// creatorId: ObjectId(creatorId),
		name,
		url,
		description,
		sponsored,
		path,
		createdAt: new Date(),
		updatedAt: new Date()
	}

	const { insertedId } = await db
		.collection("gallery")
		.insertOne({ ...image })
	return insertedId
}

export async function editGalleryImage(id, data) {
	return db
		.collection("gallery")
		.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: data },
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
}

export async function getImages() {
	return await db
		.collection("gallery")
		.find({})
		.sort({
			updatedAt: -1
		})
		.toArray()
}

export async function deleteImage(id) {
	const { deletedCount } = await db.collection("gallery").deleteOne({
		_id: new ObjectId(id)
	})
	return deletedCount
}
