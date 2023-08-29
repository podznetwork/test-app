import { getEpisodesByPodcastId } from "@/lib/api/db/episode"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	const { page, limit } = req.query
	try {
		let episodesData
		if (page) {
			episodesData = await getEpisodesByPodcastId(
				req.query.podcastId,
				parseInt(page),
				parseInt(limit)
			)
		} else {
			episodesData = await getEpisodesByPodcastId(req.query.podcastId)
		}
		return res.json({
			episodes: episodesData.episodes,
			count: episodesData.episodeCount
		})
	} catch (e) {
		console.log(e)
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
