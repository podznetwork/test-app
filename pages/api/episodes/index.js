import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { getEpisodes, getTopEpisodes } from "@/lib/api/db/episode"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	try {
		let episodes
		const { page, limit } = req.query
		if (page === undefined) {
			episodes = await getTopEpisodes(parseInt(limit))
		} else {
			episodes = await getEpisodes(parseInt(page), parseInt(limit))
		}
		return res.json(episodes)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
