import { MongoClient, ObjectId } from "mongodb"

const URL = "mongodb://127.0.0.1:27017"

async function updatePricingPlan(db) {
	const owners = await db
		.collection("users")
		.aggregate([
			{
				$match: {
					access: "owner"
				}
			},
			{
				$lookup: {
					from: "pricing",
					localField: "plan",
					foreignField: "_id",
					as: "plan"
				}
			},
			{
				$unwind: {
					path: "$plan",
					preserveNullAndEmptyArrays: true
				}
			}
		])
		.toArray()

	const plans = await db.collection("pricing").find().toArray()

	owners.forEach(owner => {
		if (!owner.plan) {
			db.collection("users").findOneAndUpdate(
				{
					_id: ObjectId(owner._id)
				},
				{
					$set: {
						plan: ObjectId(plans[0]._id)
					}
				}
			)
		}
	})
}

async function run() {
	const client = new MongoClient(URL)
	await client.connect()
	const db = client.db("podz")
	await updatePricingPlan(db)
}
