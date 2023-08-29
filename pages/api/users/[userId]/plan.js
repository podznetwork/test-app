import { updateUserById } from "@/lib/api/db"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ObjectId } from "mongodb"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.patch(async (req, res) => {
	try {
		const { plan, subscriptionId } = req.body
		const updatedUser = await updateUserById(req.query.userId, {
			plan: new ObjectId(plan),
			subscriptionId
		})

		return res.json(updatedUser)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
