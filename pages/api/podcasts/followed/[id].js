import { getFollowedPodcasts } from "@/lib/api/db"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database).get(async (req, res) => {
	try {
		const podcasts = await getFollowedPodcasts(req.query.id)
		return res.json(podcasts)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
