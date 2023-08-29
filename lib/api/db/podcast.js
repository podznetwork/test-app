import { ObjectId } from "mongodb"
import { db } from "../middlewares"
import { deleteAllPodcastEpisodes } from "./episode"

export async function addPodcastPage({
	owner,
	name,
	description,
	hosts,
	uId,
	logoPath,
	genre,
	rssLink,
	latestEpisodeDate
}) {
	let podcast = {
		owner: ObjectId(owner),
		name,
		description,
		logoPath,
		genre,
		rssLink,
		uId,
		featured: false,
		latestEpisodeDate: new Date(latestEpisodeDate),
		createdAt: new Date(),
		updatedAt: new Date()
	}

	let hostsArray = []
	for (let i = 0; i < hosts.length; i++) {
		if (hosts[i]._id.toString().match(/^[0-9a-fA-F]{24}$/)) {
			hostsArray.push({ _id: ObjectId(hosts[i]._id), confirmed: false })
		} else {
			hostsArray.push({
				_id: hosts[i]._id,
				name: hosts[i]._id,
				confirmed: false
			})
		}
	}

	podcast = {
		...podcast,
		hosts: hostsArray
	}

	const { insertedId } = await db.collection("podcasts").insertOne(podcast)
	return insertedId
}

export async function getPodcasts(owner) {
	return await db
		.collection("podcasts")
		.aggregate([
			{
				$match: {
					owner: ObjectId(owner)
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
}

export async function getPodcastsByName(name) {
	const podcasts = await db
		.collection("podcasts")
		.aggregate([
			{
				$match: {
					name
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
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "creator"
				}
			},
			{
				$unwind: "$creator"
			},
			{
				$match: {
					"creator.access": "owner"
				}
			},
			{
				$project: {
					"hostUsers._id": 1,
					"hostUsers.name": 1,
					"hostUsers.profilePicture": 1,
					hosts: 1,
					name: 1,
					logoPath: 1,
					description: 1,
					featured: 1,
					genre: 1,
					"creator._id": 1
					// creator: 0
				}
			}
		])
		.toArray()

	return podcasts
}

export async function getPodcastByUid(uid) {
	const podcast = await db
		.collection("podcasts")
		.aggregate([
			{
				$match: {
					uId: uid
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
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "creator"
				}
			},
			{
				$unwind: "$creator"
			},
			{
				$match: {
					"creator.access": "owner"
				}
			},
			{
				$project: {
					"hostUsers._id": 1,
					"hostUsers.name": 1,
					"hostUsers.profilePicture": 1,
					hosts: 1,
					name: 1,
					logoPath: 1,
					description: 1,
					featured: 1,
					genre: 1,
					"creator._id": 1
					// creator: 0
				}
			}
		])
		.toArray()

	return podcast[0]
}

export async function getPodcastByName(name) {
	const podcast = await db
		.collection("podcasts")
		.aggregate([
			{
				$match: {
					name
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
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "creator"
				}
			},
			{
				$unwind: "$creator"
			},
			{
				$match: {
					"creator.access": "owner"
				}
			},
			{
				$project: {
					"hostUsers._id": 1,
					"hostUsers.name": 1,
					"hostUsers.profilePicture": 1,
					hosts: 1,
					name: 1,
					logoPath: 1,
					description: 1,
					featured: 1,
					genre: 1,
					"creator._id": 1
					// creator: 0
				}
			}
		])
		.toArray()

	return podcast[0]
}

export async function getPodcast(id) {
	const podcast = await db
		.collection("podcasts")
		.aggregate([
			{
				$match: {
					_id: new ObjectId(id)
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
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "creator"
				}
			},
			{
				$unwind: "$creator"
			},
			{
				$match: {
					"creator.access": "owner"
				}
			},
			{
				$project: {
					"hostUsers._id": 1,
					"hostUsers.name": 1,
					"hostUsers.profilePicture": 1,
					hosts: 1,
					name: 1,
					logoPath: 1,
					description: 1,
					featured: 1,
					genre: 1,
					"creator._id": 1
					// creator: 0
				}
			}
		])
		.toArray()

	return podcast[0]
}

export async function getAllPodcasts(limit) {
	let query = [
		{
			$lookup: {
				from: "users",
				localField: "hosts._id",
				foreignField: "_id",
				as: "hostUsers"
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "owner",
				foreignField: "_id",
				as: "creator"
			}
		},
		{
			$unwind: "$creator"
		},
		{
			$match: {
				"creator.access": "owner"
			}
		}
	]

	limit
		? query.push(
				{
					$project: {
						uId: 1,
						name: 1,
						logoPath: 1
					}
				},
				{ $limit: Number(limit) }
		  )
		: query.push({
				$project: {
					"hostUsers.password": 0,
					"hostUsers.approved": 0,
					"hostUsers.email": 0,
					"hostUsers.verified": 0,
					"hostUsers.access": 0,
					creator: 0
				}
		  })
	return await db.collection("podcasts").aggregate(query).toArray()
}

export async function getPodcastsForHost(hostId) {
	return await db
		.collection("podcasts")
		.aggregate([
			{
				$unwind: {
					path: "$hosts",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$match: {
					"hosts._id": ObjectId(hostId)
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
}

export async function getFeaturedPodcasts() {
	return await db
		.collection("podcasts")
		.aggregate([
			{
				$match: { featured: true }
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "creator"
				}
			},
			{
				$unwind: "$creator"
			},
			{
				$match: {
					"creator.access": "owner"
				}
			},
			{
				$project: {
					uId: 1,
					name: 1,
					logoPath: 1,
					description: 1,
					featured: 1
				}
			}
		])
		.toArray()
}

export async function editPodcast(id, data) {
	let updatedPodcast = { ...data, updatedAt: new Date() }

	let hostsArray = []
	if (data.hosts) {
		for (let i = 0; i < data.hosts.length; i++) {
			if (data.hosts[i]._id.match(/^[0-9a-fA-F]{24}$/)) {
				hostsArray.push({
					_id: ObjectId(data.hosts[i]._id),
					confirmed: false
				})
			} else {
				hostsArray.push({
					_id: data.hosts[i]._id,
					name: data.hosts[i]._id,
					confirmed: false
				})
			}
		}

		updatedPodcast = {
			...updatedPodcast,
			hosts: hostsArray
		}
	}

	return db
		.collection("podcasts")
		.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{ $set: updatedPodcast },
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
}

//Automatically confirm the hosts for the podcast
export async function editPodcastByAdmin(id, data) {
	let updatedPodcast = { ...data, updatedAt: new Date() }

	let hostsArray = []
	if (data.hosts) {
		for (let i = 0; i < data.hosts.length; i++) {
			if (data.hosts[i]._id.match(/^[0-9a-fA-F]{24}$/)) {
				hostsArray.push({
					_id: ObjectId(data.hosts[i]._id),
					confirmed: true
				})
			} else {
				hostsArray.push({
					_id: data.hosts[i]._id,
					name: data.hosts[i]._id,
					confirmed: true
				})
			}
		}

		updatedPodcast = {
			...updatedPodcast,
			hosts: hostsArray
		}
	}

	return db
		.collection("podcasts")
		.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{ $set: updatedPodcast },
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
}

export async function changePodcastHostStatus(id, hostId, status) {
	return db
		.collection("podcasts")
		.findOneAndUpdate(
			{ _id: ObjectId(id), "hosts._id": ObjectId(hostId) },
			{ $set: { "hosts.$.confirmed": status } }
		)
		.then(({ value }) => value)
}

export async function declinePodcastHosting(id, hostId) {
	return db
		.collection("podcasts")
		.findOneAndUpdate(
			{ _id: ObjectId(id), "hosts._id": ObjectId(hostId) },
			{ $set: { "hosts.$.status": "declined" } }
		)
		.then(({ value }) => value)
}

export async function deletePodcast(id) {
	const { deletedCount } = await db.collection("podcasts").deleteOne({
		_id: new ObjectId(id)
	})

	await deleteAllPodcastEpisodes(id)

	return deletedCount
}
