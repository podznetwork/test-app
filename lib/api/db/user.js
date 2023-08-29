import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"
import { db } from "../middlewares"

export async function findUserWithEmailAndPassword(email, password) {
	email = String(email).toLowerCase()
	const user = await db.collection("users").findOne({ email })
	if (user && (await bcrypt.compare(password, user.password))) {
		return { ...user, password: undefined } // filtered out password
	}
	return null
}

export async function getAdminUser() {
	return await db
		.collection("users")
		.findOne({ role: "admin" }, { projection: dbProjectionUsers() })
		.then(user => user || null)
}

export async function findUserForAuth(userId) {
	return db
		.collection("users")
		.findOne({ _id: ObjectId(userId) }, { projection: { password: 0 } })
		.then(user => user || null)
}

export async function findUserById(userId) {
	const users = await db
		.collection("users")
		.aggregate([
			{
				$match: {
					_id: ObjectId(userId)
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
			},
			{
				$lookup: {
					from: "podcasts",
					localField: "followedPodcasts._id",
					foreignField: "_id",
					as: "podcasts"
				}
			},
			{
				$project: {
					accessToken: 0,
					password: 0,
					emailVerified: 0,
					followedPodcasts: 0
				}
			}
		])
		.toArray()

	return users[0]
}

export async function findUserByUsername(username) {
	return db
		.collection("users")
		.findOne({ username }, { projection: dbProjectionUsers() })
		.then(user => user || null)
}

export async function findUserByEmail(email) {
	email = String(email).toLowerCase()
	return db
		.collection("users")
		.findOne({ email }, { projection: dbProjectionUsers() })
		.then(user => user || null)
}

export async function updateUserById(id, data) {
	return db
		.collection("users")
		.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{ $set: data },
			{ returnDocument: "after", projection: { password: 0 } }
		)
		.then(({ value }) => value)
}

export async function getUsers() {
	return await db
		.collection("users")
		.find({ role: { $ne: "admin" } }, { projection: dbProjectionUsers() })
		.toArray()
}

export async function getUsersByRole({ userType }) {
	return await db
		.collection("users")
		.find(
			{ $or: [{ access: userType }, { role: userType }] },
			{ projection: dbProjectionUsers() }
		)
		.sort({ name: 1 })
		.toArray()
}

export async function addAdminUser({ email, name, role, access }) {
	const user = {
		emailVerified: false,
		email,
		name,
		role,
		access: [...access, "user"],
		approved: true,
		createdAt: new Date(),
		updatedAt: new Date(),
		becomeHost: true,
		seeFavz: true,
		allowMessages: true,
		allowGuestRequests: true
	}

	const { insertedId } = await db.collection("users").insertOne({ ...user })
	return insertedId
}

export async function editAdminUser(id, data) {
	const updatedUser = { ...data, updatedAt: new Date() }

	const { matchedCount } = await db
		.collection("users")
		.updateOne({ _id: ObjectId(id) }, { $set: updatedUser })

	return matchedCount
}

export async function completeSignUp(id, { originalPassword, name, username }) {
	const password = await bcrypt.hash(originalPassword, 10)

	const updatedUser = {
		password,
		name,
		username,
		emailVerified: true,
		seeFavz: true,
		becomeHost: true,
		allowMessages: true,
		allowGuestRequests: true
	}
	const { matchedCount } = await db
		.collection("users")
		.updateOne({ _id: ObjectId(id) }, { $set: updatedUser })

	return matchedCount
}

export async function addUser({
	email,
	originalPassword,
	name,
	username,
	bio = "",
	role
}) {
	const user = {
		emailVerified: false,
		// profilePicture,
		email,
		name,
		username,
		bio,
		role: "user",
		access: ["user"],
		seeFavz: true,
		becomeHost: true,
		allowMessages: true,
		allowGuestRequests: true
	}
	const password = await bcrypt.hash(originalPassword, 10)
	const { insertedId } = await db
		.collection("users")
		.insertOne({ ...user, password })
	return insertedId
}

export async function addGoogleUser({
	email,
	bio = "",
	name,
	profilePicture,
	accessToken,
	tokenExpiry
}) {
	const user = {
		emailVerified: true,
		role: "user",
		profilePicture,
		email: String(email).toLowerCase(),
		name,
		bio,
		access: ["user"],
		accessToken,
		tokenExpiry,
		approved: true,
		seeFavz: true,
		becomeHost: true,
		allowMessages: true,
		allowGuestRequests: true
	}

	const { insertedId } = await db.collection("users").insertOne(user)
	return insertedId
}

export async function addSuperAdmin() {
	const password = await bcrypt.hash(process.env.SEED_ADMIN_PASS, 10)
	const user = {
		name: "PodZ Admin",
		email: process.env.SEED_ADMIN_EMAIL,
		password,
		role: "admin",
		access: ["admin"],
		emailVerified: true,
		username: "admin_podz",
		approved: true
	}
	return await db.collection("users").insertOne(user)
}

export async function updateUserPasswordByOldPassword(
	id,
	oldPassword,
	newPassword
) {
	const user = await db.collection("users").findOne(ObjectId(id))
	if (!user) return false
	const matched = await bcrypt.compare(oldPassword, user.password)
	if (!matched) return false
	const password = await bcrypt.hash(newPassword, 10)
	await db
		.collection("users")
		.updateOne({ _id: ObjectId(id) }, { $set: { password } })
	return true
}

export async function updateUserPassword(id, newPassword) {
	const user = await db.collection("users").findOne(ObjectId(id))
	if (!user) return false
	const password = await bcrypt.hash(newPassword, 10)
	await db
		.collection("users")
		.updateOne({ _id: ObjectId(id) }, { $set: { password } })
	return true
}

export async function followPodcast(userId, podcastId) {
	return await db
		.collection("users")
		.findOneAndUpdate(
			{
				_id: ObjectId(userId)
			},
			{
				$push: {
					followedPodcasts: {
						_id: ObjectId(podcastId),
						followedAt: new Date(),
						updatedAt: new Date()
					}
				}
			},
			{
				returnDocument: "after"
			}
		)
		.then(({ value }) => value)
}

export async function unfollowPodcast(userId, podcastId) {
	return await db
		.collection("users")
		.findOneAndUpdate(
			{
				_id: ObjectId(userId)
			},
			{
				$pull: {
					followedPodcasts: {
						_id: ObjectId(podcastId)
					}
				}
			},
			{
				returnDocument: "after"
			}
		)
		.then(({ value }) => value)
}

export async function getFollowedPodcast(userId, podcastId) {
	return await db
		.collection("users")
		.aggregate([
			{ $unwind: "$followedPodcasts" },
			{
				$match: {
					"followedPodcasts._id": ObjectId(podcastId),
					_id: ObjectId(userId)
				}
			},
			{
				$lookup: {
					from: "podcasts",
					localField: "followedPodcasts._id",
					foreignField: "_id",
					as: "podcast"
				}
			},
			{
				$unwind: "$podcast"
			},
			{
				$project: {
					podcast: 1
				}
			}
		])
		.toArray()
}

export async function getFollowedPodcasts(user_id) {
	const user = await db.collection("users").findOne(ObjectId(user_id))
	const followedPodcasts = user.followedPodcasts.map(({ _id }) => _id)

	return await db
		.collection("podcasts")
		.aggregate([
			{
				$match: {
					_id: {
						$in: followedPodcasts
					}
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "hosts._id",
					foreignField: "_id",
					as: "hostUsers"
				}
			}
		])
		.toArray()
}
export async function UNSAFE_updateUserPassword(id, newPassword) {
	const password = await bcrypt.hash(newPassword, 10)
	await db
		.collection("users")
		.updateOne({ _id: ObjectId(id) }, { $set: { password } })
}

export function dbProjectionUsers(prefix = "") {
	return {
		[`${prefix}accessToken`]: 0,
		[`${prefix}password`]: 0,
		[`${prefix}emailVerified`]: 0
	}
}

export async function deleteUser(id) {
	const { deletedCount } = await db.collection("users").deleteOne({
		_id: ObjectId(id)
	})

	return deletedCount
}

export async function getUserCount(role) {
	const userCount = await db.collection("users").countDocuments({
		access: role
	})
	return userCount
}
