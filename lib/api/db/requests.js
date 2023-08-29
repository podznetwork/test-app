import { ObjectId } from "mongodb"
import { db } from "../middlewares"

export async function addRequest(userId, data) {
	let request = {
		userId: ObjectId(userId),
		...data,
		status: data.status ?? "pending",
		startDate: data.startDate ? new Date(data.startDate) : new Date(),
		createdAt: new Date(),
		updatedAt: new Date()
	}

	let hostsArray = []
	if (data.role === "owner") {
		for (let i = 0; i < request?.hosts?.length; i++) {
			if (request.hosts[i]._id.match(/^[0-9a-fA-F]{24}$/)) {
				hostsArray.push({
					_id: ObjectId(request.hosts[i]._id),
					confirmed: false
				})
			} else {
				hostsArray.push({
					_id: request.hosts[i]._id,
					name: request.hosts[i]._id,
					confirmed: false
				})
			}
		}
	}

	request = {
		...request,
		hosts: hostsArray
	}

	const { insertedId } = db.collection("requests").insertOne(request)
	return insertedId
}

export async function getRequests() {
	return db
		.collection("requests")
		.aggregate([
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user"
				}
			},
			{
				$unwind: {
					path: "$user",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$addFields: {
					name: "$user.name",
					email: "$user.email",
					access: "$user.access"
				}
			},
			{
				$project: {
					user: 0
				}
			}
		])
		.toArray()
}

export async function getRequestByUserId(userId, role) {
	const requests = await db
		.collection("requests")
		.aggregate([
			{
				$match: {
					userId: ObjectId(userId),
					role: role
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "hosts._id",
					foreignField: "_id",
					as: "hostUsers"
				}
			},
			{
				$project: {
					"hostUsers.password": 0,
					"hostUsers.approved": 0,
					"hostUsers.email": 0,
					"hostUsers.verified": 0,
					"hostUsers.access": 0
				}
			}
		])
		.toArray()

	return requests[0]
}

export async function updateRequest(id, data) {
	const newRequest = { ...data, updatedAt: new Date() }

	if (data.startDate) {
		newRequest.startDate = new Date(data.startDate)
	}

	if (data.userId) {
		newRequest.userId = ObjectId(data.userId)
	}

	return db
		.collection("requests")
		.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{ $set: newRequest },
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
}

export async function updateOwnerRequestByUserId(userId, data) {
	const newRequest = {
		...data,
		updatedAt: new Date()
	}

	return db
		.collection("requests")
		.findOneAndUpdate(
			{ userId: ObjectId(userId), role: "owner" },
			{
				$set: {
					...newRequest
				}
			},
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
}

export async function deleteRequest(id) {
	return await db
		.collection("requests")
		.deleteOne({ _id: ObjectId(id) })
		.then(({ value }) => value)
}
