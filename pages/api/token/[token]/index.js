import { findTokenByIdAndType } from "@/lib/api/db"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	const id = req.query.token
	const token = await findTokenByIdAndType(id, "userSignup")

	return res.json(token)
})

export default router.handler(ncRouteHandlerOpts)
