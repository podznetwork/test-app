import { addEpisode } from "@/lib/api/db/episode"
import {
	editPodcast,
	getAllPodcasts,
	getFeaturedPodcasts
} from "@/lib/api/db/podcast"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"
import Parser from "rss-parser"
import { stripHtml } from "string-strip-html"

const router = createRouter()
const parser = new Parser()

router.use(database)

router.get(async (req, res) => {
	try {
		const { featured, limit } = req.query
		let podcasts
		if (featured) {
			podcasts = await getFeaturedPodcasts()
		} else {
			podcasts = await getAllPodcasts(limit)
		}

		return res.json(podcasts)
	} catch (e) {
		console.log(e)
		return res.status(500).end()
	}
})

router.post(async (req, res) => {
	try {
		const podcasts = await getAllPodcasts()

		let savedEpisodes = []
		for (let i = 0; i < podcasts.length; i++) {
			let latestEpisodeDate = new Date("01-01-1900")
			const feed = await parser.parseURL(podcasts[i].rssLink)
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

					const episodeId = await addEpisode(newEpisode)
					newEpisode._id = episodeId
					savedEpisodes.push(newEpisode)

					if (new Date(episodes[j].pubDate) > latestEpisodeDate) {
						latestEpisodeDate = new Date(episodes[j].pubDate)
					}
				}
			}

			if (latestEpisodeDate > podcasts[i].latestEpisodeDate) {
				await editPodcast(podcasts[i]._id, { latestEpisodeDate })
			}
		}

		return res.json(savedEpisodes)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
