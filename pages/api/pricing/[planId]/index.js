import { deletePricingPlan, editPricingPlan } from "@/lib/api/db/pricing"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()
router.use(database, tokenChecker)

router.put(async (req, res) => {
	try {
		const updatedPlan = editPricingPlan(req.query.planId, req.body)
		return res.json(updatedPlan)
	} catch (e) {
		return res.status(500).end()
	}
})

router.delete(async (req, res) => {
	try {
		await deletePricingPlan(req.query.planId)
		return res.status(200).end()
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
