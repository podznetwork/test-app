import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { getEpisodeGuests } from "@/lib/api/db/episode"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	try {
		const guests = await getEpisodeGuests(req.query.id)

		return res.json(guests)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
