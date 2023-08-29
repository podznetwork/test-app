import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { getSubscription__server, refundUser__Server } from "@/lib/app/payment"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	try {
		const { id } = req.query

		const response = await getSubscription__server(id)
		return res.json(response)
	} catch (e) {
		res.status(500).end()
	}
})

//Request for refunding the user on cancellation of subscription
router.post(async (req, res) => {
	try {
		const response = await refundUser__Server(req.body)
		return res.json(response)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
