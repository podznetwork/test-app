import {
	getPodcastsForHost
} from "@/lib/api/db/podcast"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	const { userId } = req.query
	try {
		const podcasts = await getPodcastsForHost(userId)
		return res.json(podcasts)
	} catch (e) {
		return res.status(500).end()
	}
})


export default router.handler(ncRouteHandlerOpts)
