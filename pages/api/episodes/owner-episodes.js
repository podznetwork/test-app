import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { getOwnerEpisodes } from "@/lib/api/db/episode"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	try {
		const { page, limit } = req.query
		const episodes = await getOwnerEpisodes(
			req.user._id,
			parseInt(page),
			parseInt(limit)
		)

		return res.json(episodes)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
