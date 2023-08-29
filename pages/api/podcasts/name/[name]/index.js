import { getPodcastByUid } from "@/lib/api/db/podcast"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database).get(async (req, res) => {
	try {
		const podcasts = await getPodcastByUid(req.query.name)
		return res.json(podcasts)
	} catch (e) {
		console.log(e)
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
