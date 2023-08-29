import { getPodcasts } from "@/lib/api/db/podcast"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	const { userId } = req.query
	try {
		const podcasts = await getPodcasts(userId)
		return res.json(podcasts)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
