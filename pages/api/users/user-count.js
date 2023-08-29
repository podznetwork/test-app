import { getUserCount } from "@/lib/api/db"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	try {
		const userCount = await getUserCount(req.query.userType)
		return res.json({ userCount })
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
