import { getFollowedPodcasts } from "@/lib/api/db"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker).get(async (req, res) => {
	try {
		const podcasts = await getFollowedPodcasts(req.user._id)
		return res.json(podcasts)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
