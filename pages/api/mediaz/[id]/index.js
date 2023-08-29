import { deleteMediaZ } from "@/lib/api/db/mediaz"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker)

router.delete(async (req, res) => {
	try {
		await deleteMediaZ(req.query.id)
		return res.status(200).end()
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
