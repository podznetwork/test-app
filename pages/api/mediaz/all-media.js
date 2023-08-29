import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"
import { getAllMediaZ } from "@/lib/api/db/mediaz"
const router = createRouter()

router.use(tokenChecker, database)

router.get(async (req, res) => {
	try {
		const mediaZ = await getAllMediaZ()
		res.status(200).json(mediaZ)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			error: { message: "Internal server error." }
		})
	}
})

export default router.handler(ncRouteHandlerOpts)
