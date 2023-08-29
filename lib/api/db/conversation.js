import { ObjectId } from "mongodb"
import { db } from "../middlewares"

export async function addConversation({ senderId, receiverId }) {
	const conversation = {
		senderId: ObjectId(senderId),
		receiverId: ObjectId(receiverId),
		newMessage: false,
		messages: []
	}

	const { insertedId } = await db
		.collection("conversations")
		.insertOne(conversation)

	return insertedId
}

export async function getConversationBySenderAndReceiverId({
	senderId,
	receiverId
}) {
	return db.collection("conversations").findOne({
		$or: [
			{
				senderId: ObjectId(senderId),
				receiverId: ObjectId(receiverId)
			},
			{
				senderId: ObjectId(receiverId),
				receiverId: ObjectId(senderId)
			}
		]
	})
}

export async function getConversations({ senderId }) {
	return db
		.collection("conversations")
		.aggregate([
			{
				$match: {
					$or: [
						{
							senderId: ObjectId(senderId)
						},
						{
							receiverId: ObjectId(senderId)
						}
					]
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "senderId",
					foreignField: "_id",
					as: "sender"
				}
			},
			{
				$unwind: "$sender"
			},
			{
				$lookup: {
					from: "users",
					localField: "receiverId",
					foreignField: "_id",
					as: "receiver"
				}
			},
			{
				$unwind: "$receiver"
			},
			{
				$project: {
					_id: 1,
					newMessage: 1,
					receiverId: 1,
					senderId: 1,
					senderNewMessage: 1,
					receiverNewMessage: 1,
					"sender.name": 1,
					"sender.profilePicture": 1,
					"sender.role": 1,
					"sender.username": 1,
					"receiver.name": 1,
					"receiver.profilePicture": 1,
					"receiver.role": 1,
					"receiver.username": 1
				}
			}
		])
		.toArray()
}

export async function getConversationsNewMessageCount({ senderId }) {
	const conversations = await db
		.collection("conversations")
		.aggregate([
			{
				$match: {
					$or: [
						{
							senderId: ObjectId(senderId)
						},
						{
							receiverId: ObjectId(senderId)
						}
					]
				}
			}
		])
		.toArray()

	const filteredConversations = conversations.filter(
		({ senderId: sId, senderNewMessage, receiverNewMessage }) => {
			return (
				(sId.equals(ObjectId(senderId)) && receiverNewMessage) ||
				(!sId.equals(ObjectId(senderId)) && senderNewMessage)
			)
		}
	)

	return filteredConversations.length
}

export async function addMessage({ conversationId, senderId, message }) {
	const newMessageObj = {
		messageId: new ObjectId(),
		senderId: ObjectId(senderId),
		message,
		sentAt: new Date()
	}

	const conversation = await db
		.collection("conversations")
		.findOneAndUpdate(
			{ _id: ObjectId(conversationId) },
			{ $push: { messages: newMessageObj } },
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
	console.log(conversation.senderId, new ObjectId(senderId))
	if (conversation.senderId.equals(ObjectId(senderId))) {
		return db
			.collection("conversations")
			.findOneAndUpdate(
				{ _id: ObjectId(conversationId) },
				{ $set: { senderNewMessage: true } },
				{ returnDocument: "after" }
			)
			.then(({ value }) => value)
	} else {
		return db
			.collection("conversations")
			.findOneAndUpdate(
				{ _id: ObjectId(conversationId) },
				{ $set: { receiverNewMessage: true } },
				{ returnDocument: "after" }
			)
			.then(({ value }) => value)
	}
}

export async function getConversation(id) {
	return db
		.collection("conversations")
		.aggregate([
			{
				$match: {
					_id: ObjectId(id)
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "senderId",
					foreignField: "_id",
					as: "sender"
				}
			},
			{
				$unwind: "$sender"
			},
			{
				$lookup: {
					from: "users",
					localField: "receiverId",
					foreignField: "_id",
					as: "receiver"
				}
			},
			{
				$unwind: "$receiver"
			},
			{
				$project: {
					_id: 1,
					messages: 1,
					newMessage: 1,
					receiverId: 1,
					senderId: 1,
					senderNewMessage: 1,
					receiverNewMessage: 1,
					"sender.name": 1,
					"sender.profilePicture": 1,
					"sender.role": 1,
					"sender.username": 1,
					"receiver.name": 1,
					"receiver.profilePicture": 1,
					"receiver.role": 1,
					"receiver.username": 1
				}
			}
		])
		.toArray()
}

export async function updateConversationStatus({ id, status, userId }) {
	const conversation = await db.collection("conversations").findOne({
		_id: ObjectId(id)
	})

	if (conversation.senderId.equals(ObjectId(userId))) {
		return db
			.collection("conversations")
			.findOneAndUpdate(
				{
					_id: ObjectId(id)
				},
				{ $set: { receiverNewMessage: false } }
			)
			.then(({ value }) => value)
	} else {
		return db
			.collection("conversations")
			.findOneAndUpdate(
				{
					_id: ObjectId(id)
				},
				{ $set: { senderNewMessage: false } }
			)
			.then(({ value }) => value)
	}
}

export async function addAdminMessage(userId, message) {
	const admin = await db.collection("users").findOne({
		access: "admin"
	})
	await db.collection("conversations").findOneAndUpdate(
		{ senderId: new ObjectId(admin._id) },
		{
			$set: {
				receiverId: new ObjectId(userId),
				newMessage: true
			},
			$push: {
				messages: {
					messageId: new ObjectId(),
					senderId: new ObjectId(admin._id),
					message
				}
			}
		},
		{
			upsert: true
		}
	)
}
