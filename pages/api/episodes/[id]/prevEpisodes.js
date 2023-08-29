import { getPreviousEpisodes } from "@/lib/api/db/episode"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	try {
		const episode = await getPreviousEpisodes(req.query.id, req.query.limit)
		return res.json(episode)
	} catch (e) {
		console.log(e)
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
