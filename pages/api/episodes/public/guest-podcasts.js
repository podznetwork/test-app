import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { getEpisodesForGuest } from "@/lib/api/db/episode"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	const { userId } = req.query
	try {
		const episodes = await getEpisodesForGuest(userId)
		return res.json(episodes)
	} catch (e) {
		return res.status(500).end()
	}
})


export default router.handler(ncRouteHandlerOpts)
