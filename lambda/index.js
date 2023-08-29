import { MongoClient, ObjectId } from "mongodb"
import Parser from "rss-parser"
import { stripHtml } from "string-strip-html"

// This is a production URL, use it carefully
const URL =
	"mongodb+srv://admin:nPlttwKWt9Gi5ktK@podz.druig9d.mongodb.net/podz?retryWrites=true&w=majority"

const parser = new Parser()

async function addEpisode(
	{
		name,
		description,
		podcastId,
		enclosure,
		imagePath,
		pubDate,
		keywords = [],
		genre
	},
	db
) {
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
async function editPodcast(id, data, db) {
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
				hostsArray.push({ name: data.hosts[i]._id, confirmed: false })
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
const refetchEpisodes = async db => {
	const podcasts = await db.collection("podcasts").find().toArray()
	let savedEpisodes = []
	for (let i = 0; i < podcasts.length; i++) {
		let latestEpisodeDate = new Date("01-01-1900")
		const feed = await parser.parseURL(podcasts[i].rssLink)
		console.log(
			"Fetching RSS feed for podcast: " +
				podcasts[i].name +
				"rssLink: " +
				podcasts[i].rssLink
		)
		const episodes = feed.items ?? []
		for (let j = 0; j < episodes.length; j++) {
			if (
				new Date(episodes[j].pubDate) >
				new Date(podcasts[i].latestEpisodeDate)
			) {
				const newEpisode = {
					name: episodes[j].title,
					description:
						stripHtml(
							episodes[j].content ??
								episodes[j].itunes?.summary ??
								""
						).result ?? "",
					imagePath:
						episodes[j].itunes?.image ?? podcasts[i].logoPath,
					podcastId: podcasts[i]._id,
					enclosure: episodes[j].enclosure.url,
					pubDate: episodes[j].pubDate,
					keywords: episodes[j].keywords ?? [],
					genre: podcasts[i].genre
				}
				const episodeId = await addEpisode(newEpisode, db)
				newEpisode._id = episodeId
				savedEpisodes.push(newEpisode)
				if (new Date(episodes[j].pubDate) > latestEpisodeDate) {
					latestEpisodeDate = new Date(episodes[j].pubDate)
				}
			}
		}
		if (latestEpisodeDate > podcasts[i].latestEpisodeDate) {
			await editPodcast(podcasts[i]._id, { latestEpisodeDate }, db)
		}
	}
	console.log("Completed: Fetching and updating episodes")
}

async function run() {
	// if (err) throw err
	const client = new MongoClient(URL)
	await client.connect()
	const db = client.db("podz")
	await refetchEpisodes(db)
}

export const handler = async event => {
	console.log("Fetching Podcasts from RSS Links")
	return await run()
}
