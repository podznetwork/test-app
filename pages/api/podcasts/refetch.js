import Parser from "rss-parser"
import {
	getRequestByUserId,
	updateOwnerRequestByUserId
} from "@/lib/api/db/requests"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"
import { addPodcastPage, getPodcastByName } from "@/lib/api/db/podcast"
import { stripHtml } from "string-strip-html"
import { addEpisode } from "@/lib/api/db/episode"
import { findUserById } from "@/lib/api/db"

const router = createRouter()
const parser = new Parser()
router.use(database)

//Receive subscription activation hooks
router.post(async (req, res) => {
	try {
		const user = await findUserById(req.body._id)
		const request = await getRequestByUserId(req.body._id, "owner")
		if (!request?.alreadyAdded) {
			let feed = await parser.parseURL(request.rssLink)
			const rssResponse = {
				title: feed.title,
				description: feed.description,
				itunes: {
					categories: feed.itunes?.categories
				},
				image: {
					url: feed.image?.url
				},
				items: []
			}

			for (let i = 0; i < feed.items.length; i++) {
				const episode = {
					title: feed.items[i].title ?? null,
					content: feed.items[i].content ?? null,
					itunes: {
						summary: feed.items[i].itunes?.summary ?? null,
						image: feed.items[i].itunes?.image ?? null
					},
					enclosure: {
						url: feed.items[i].enclosure?.url ?? null
					},
					pubDate: feed.items[i].pubDate ?? null,
					keywords: feed.items[i].keywords ?? null
				}
				rssResponse.items[i] = episode
			}

			const episodes = rssResponse.items
			let latestEpisodeDate = new Date("01-01-1900")
			for (let i = 0; i < episodes.length; i++) {
				const pubDate = new Date(episodes[i].pubDate)
				if (pubDate > latestEpisodeDate) {
					latestEpisodeDate = pubDate
				}
			}

			const prevPodcasts = await getPodcastByName(
				rssResponse.title ?? request.podcastName
			)

			const name = rssResponse.title ?? request.podcastName

			let uId = name.split(" ").join("_").toLowerCase()

			if (prevPodcasts?.length > 0) {
				uId += `_${prevPodcasts.length}`
			}

			const podcastId = await addPodcastPage({
				owner: user._id,
				name: rssResponse.title ?? request.podcastName,
				description:
					rssResponse.description ?? request.podcastDescription,
				hosts: request.hosts,
				logoPath: rssResponse.image.url,
				genre: rssResponse?.itunes?.categories ?? request.genre,
				rssLink: request.rssLink,
				uId,
				latestEpisodeDate
			})

			for (let i = 0; i < episodes.length; i++) {
				const newEpisode = {
					name: episodes[i].title,
					description:
						stripHtml(
							episodes[i].content ??
								episodes[i].itunes?.summary ??
								""
						).result ?? "",
					imagePath:
						episodes[i].itunes?.image ?? rssResponse.image.url,
					podcastId,
					enclosure: episodes[i].enclosure.url,
					pubDate: episodes[i].pubDate,
					keywords: episodes[i].keywords ?? [],
					genre: request.genre
				}

				const episodeId = await addEpisode(newEpisode)

				newEpisode._id = episodeId
			}
		}

		await updateOwnerRequestByUserId(user._id, {
			alreadyAdded: true
		})

		return res.status(200).end()
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
