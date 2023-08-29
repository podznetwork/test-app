import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import {
	cancelSubscription__server,
	createSubscriptionPlan__server,
	updateSubscriptionPricing__server
} from "@/lib/app/payment"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(tokenChecker, database)

router.post(async (req, res) => {
	try {
		const response = await createSubscriptionPlan__server(req.body)
		return res.json(response)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

router.put(async (req, res) => {
	try {
		const response = await updateSubscriptionPricing__server(
			req.body.planId,
			req.body.updatedPlanPricing
		)
		return res.json(response)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

router.delete(async (req, res) => {
	try {
		const response = await cancelSubscription__server(req.body)
		return res.json(response)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
