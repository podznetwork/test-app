import { ObjectId } from "mongodb"
import { db } from "../middlewares"

export async function addEpisode({
	name,
	description,
	podcastId,
	enclosure,
	imagePath,
	pubDate,
	keywords = [],
	genre
}) {
	const episode = {
		podcast: podcastId,
		name,
		description,
		enclosure,
		pubDate: new Date(pubDate),
		keywords,
		genre,
		imagePath,
		createdAt: new Date(),
		updatedAt: new Date()
	}

	const { insertedId } = await db.collection("episodes").insertOne(episode)

	return insertedId
}

export async function getEpisode(id) {
	const episode = await db
		.collection("episodes")
		.aggregate([
			{
				$match: {
					_id: ObjectId(id)
				}
			},
			{
				$lookup: {
					from: "podcasts",
					localField: "podcast",
					foreignField: "_id",
					as: "podcast"
				}
			},
			{
				$unwind: "$podcast"
			},
			{
				$lookup: {
					from: "users",
					localField: "guests._id",
					foreignField: "_id",
					as: "guestUsers"
				}
			},
			{
				$project: {
					"guestUsers.password": 0,
					"guestUsers.approved": 0,
					"guestUsers.email": 0,
					"guestUsers.verified": 0,
					"guestUsers.access": 0
				}
			}
		])
		.toArray()

	return episode[0]
}

export async function getPreviousEpisodes(id, limit) {
	const episode = await getEpisode(id)

	const query = [
		{
			$match: {
				podcast: new ObjectId(episode.podcast._id),
				pubDate: {
					$lt: episode.pubDate
				}
			}
		},
		{
			$sort: {
				pubDate: -1
			}
		},
		{
			$lookup: {
				from: "podcasts",
				localField: "podcast",
				foreignField: "_id",
				as: "podcast"
			}
		},
		{
			$unwind: "$podcast"
		},
		{
			$addFields: {
				podcastTitle: "$podcast.name"
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "guests._id",
				foreignField: "_id",
				as: "guestUsers"
			}
		},
		{
			$project: {
				"guestUsers.password": 0,
				"guestUsers.approved": 0,
				"guestUsers.email": 0,
				"guestUsers.verified": 0,
				"guestUsers.access": 0
			}
		}
	]

	if (limit) {
		query.push({
			$limit: parseInt(limit)
		})
	}

	const episodes = await db.collection("episodes").aggregate(query).toArray()

	return episodes
}

export async function getEpisodes(page, limit) {
	let episodes

	const query = [
		{
			$match: {}
		},
		{
			$sort: {
				pubDate: -1
			}
		},
		{
			$lookup: {
				from: "podcasts",
				localField: "podcast",
				foreignField: "_id",
				as: "podcast"
			}
		},
		{
			$unwind: "$podcast"
		},
		{
			$addFields: {
				podcastTitle: "$podcast.name"
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "guests._id",
				foreignField: "_id",
				as: "guestUsers"
			}
		},
		{
			$project: {
				"guestUsers.password": 0,
				"guestUsers.approved": 0,
				"guestUsers.email": 0,
				"guestUsers.verified": 0,
				"guestUsers.access": 0
			}
		}
	]

	if (page != undefined) {
		query.splice(2, 0, {
			$skip: page * limit
		})

		query.push({
			$limit: limit
		})
	}

	episodes = await db.collection("episodes").aggregate(query).toArray()

	const episodeCount = await db.collection("episodes").countDocuments()

	return { episodes, episodeCount }
}

export async function getOwnerEpisodes(ownerId, page, limit) {
	const episodes = await db
		.collection("episodes")
		.aggregate([
			{
				$sort: {
					pubDate: -1
				}
			},
			{
				$lookup: {
					from: "podcasts",
					localField: "podcast",
					foreignField: "_id",
					as: "podcast"
				}
			},
			{
				$unwind: "$podcast"
			},
			{
				$match: {
					"podcast.owner": ObjectId(ownerId)
				}
			},
			{
				$addFields: {
					podcastTitle: "$podcast.name"
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "guests._id",
					foreignField: "_id",
					as: "guestUsers"
				}
			},
			{
				$project: {
					"guestUsers.password": 0,
					"guestUsers.approved": 0,
					"guestUsers.email": 0,
					"guestUsers.verified": 0,
					"guestUsers.access": 0
				}
			},
			{
				$facet: {
					paginatedResults: [
						{ $skip: page * limit },
						{ $limit: limit }
					],
					totalCount: [
						{
							$count: "count"
						}
					]
				}
			}
		])
		.toArray()

	return episodes[0]
}

export async function getEpisodeGuests(id) {
	const episode = await db
		.collection("episodes")
		.aggregate([
			{
				$match: {
					_id: new ObjectId(id)
				}
			},
			{
				$lookup: {
					from: "requests",
					localField: "guests._id",
					foreignField: "userId",
					as: "requests"
				}
			},
			{
				$unwind: {
					path: "$requests",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$match: {
					"requests.role": "guest"
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "requests.userId",
					foreignField: "_id",
					as: "requests.user"
				}
			},
			{
				$addFields: {
					name: "$requests.user.name",
					experience: "$requests.experience",
					startDate: "$requests.startDate",
					guestId: "$requests.userId"
				}
			},
			{
				$project: {
					name: 1,
					experience: 1,
					startDate: 1,
					guestId: 1
				}
			}
		])
		.toArray()

	return episode
}

export async function getEpisodesForGuest(guestId) {
	const episodes = await db
		.collection("episodes")
		.aggregate([
			{
				$unwind: {
					path: "$guests",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$match: {
					"guests._id": ObjectId(guestId)
				}
			},
			{
				$lookup: {
					from: "podcasts",
					localField: "podcast",
					foreignField: "_id",
					as: "podcast"
				}
			},
			{
				$unwind: "$podcast"
			},
			{
				$addFields: {
					podcastTitle: "$podcast.name"
				}
			}
		])
		.toArray()

	return episodes
}

export async function getEpisodesByPodcastId(podcastId, page, limit) {
	const episodes = await db
		.collection("episodes")
		.aggregate([
			{
				$match: {
					podcast: ObjectId(podcastId)
				}
			},
			{
				$sort: {
					pubDate: -1
				}
			},
			{
				$skip: page * limit
			},
			{
				$lookup: {
					from: "podcasts",
					localField: "podcast",
					foreignField: "_id",
					as: "podcast"
				}
			},
			{
				$unwind: "$podcast"
			},
			{
				$lookup: {
					from: "users",
					localField: "guests._id",
					foreignField: "_id",
					as: "guestUsers"
				}
			},
			{
				$project: {
					"guestUsers.password": 0,
					"guestUsers.approved": 0,
					"guestUsers.email": 0,
					"guestUsers.verified": 0,
					"guestUsers.access": 0
				}
			},
			{
				$limit: limit
			}
		])
		.toArray()

	const episodeCount = await db.collection("episodes").countDocuments({
		podcast: ObjectId(podcastId)
	})

	return { episodes, episodeCount }
}

export async function getTopEpisodes(count) {
	const episodes = await db
		.collection("episodes")
		.aggregate([
			{
				$lookup: {
					from: "podcasts",
					localField: "podcast",
					foreignField: "_id",
					as: "podcast"
				}
			},
			{
				$unwind: "$podcast"
			},
			{
				$addFields: {
					podcastTitle: "$podcast.name"
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "podcast.owner",
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
					genre: 1,
					pubDate: 1,
					name: 1,
					imagePath: 1,
					podcastTitle: 1,
					enclosure: 1,
					"podcast._id": 1,
					"podcast.logoPath": 1,
					"podcast.genre": 1,
					"podcast.uId": 1
				}
			},

			{
				$sort: {
					pubDate: -1
				}
			},
			{
				$limit: count
			}
		])
		.toArray()

	const episodeCount = await db.collection("episodes").countDocuments()

	return { episodes, episodeCount }
}

export async function editEpisode(id, data) {
	let newEpisode = { ...data, updatedAt: new Date() }
	let guestsArray = []
	if (data.guests) {
		for (let i = 0; i < data.guests.length; i++) {
			if (data.guests[i]._id.match(/^[0-9a-fA-F]{24}$/)) {
				guestsArray.push({
					_id: ObjectId(data.guests[i]._id),
					confirmed: false
				})
			} else {
				guestsArray.push({
					_id: data.guests[i]._id,
					name: data.guests[i]._id,
					confirmed: false
				})
			}
		}

		newEpisode = {
			...newEpisode,
			guests: guestsArray
		}
	}

	return db
		.collection("episodes")
		.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{ $set: newEpisode },
			{ returnDocument: "after" }
		)
		.then(({ value }) => value)
}

export async function deleteEpisode(id) {
	const { deletedCount } = await db.collection("episodes").deleteOne({
		_id: ObjectId(id)
	})

	return deletedCount
}

export async function deleteAllPodcastEpisodes(podcastId) {
	const { deletedCount } = await db.collection("episodes").deleteMany({
		podcast: ObjectId(podcastId)
	})

	return deletedCount
}
