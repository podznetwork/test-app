import { ObjectId } from "mongodb"
import { db } from "../middlewares"

export async function addPayment({ orderId, userId, amount, pricingPlan }) {
	const payment = {
		orderId: orderId,
		userId: ObjectId(userId),
		amount,
		pricingPlan,
		paidOn: new Date()
	}

	const { insertedId } = await db.collection("payments").insertOne(payment)
	return insertedId
}

export async function getUserBySubscriptionId(subId) {
	return db.collection("users").findOne({
		subscriptionId: subId
	})
}
