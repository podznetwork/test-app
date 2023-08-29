import { ObjectId } from "mongodb"
import { db } from "../middlewares"

export async function addPricingPlan({
	creatorId,
	name,
	price,
	description,
	paypalPlanId,
	caption,
	numberOfPodcasts,
	discountedPrice,
	features
}) {
	const plan = {
		creatorId: ObjectId(creatorId),
		name,
		description,
		paypalPlanId,
		price,
		caption,
		numberOfPodcasts,
		discountedPrice: discountedPrice === "" ? undefined : discountedPrice,
		features,
		createdAt: new Date(),
		updatedAt: new Date()
	}

	const { insertedId } = await db.collection("pricing").insertOne(plan)
	return insertedId
}

export async function getPricingPlans() {
	return await db.collection("pricing").find().sort({ price: 1 }).toArray()
}

export async function editPricingPlan(id, data) {
	const updatedPlan = {
		...data,
		updatedAt: new Date(),
		discountedPrice:
			data.discountedPrice === "" ? undefined : data.discountedPrice
	}

	return db
		.collection("pricing")
		.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{ $set: updatedPlan },
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
}

export async function deletePricingPlan(id) {
	const { deletedCount } = await db.collection("pricing").deleteOne({
		_id: new ObjectId(id)
	})
	return deletedCount
}
