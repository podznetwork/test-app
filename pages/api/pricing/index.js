import { addPricingPlan, getPricingPlans } from "@/lib/api/db/pricing"
import { database, tokenChecker, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidatePricingPlan } from "@/lib/api/validation/pricing"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database).get(async (req, res) => {
	try {
		const plans = await getPricingPlans()
		return res.json(plans)
	} catch (e) {
		return res.status(500).end()
	}
})

router.use(database, tokenChecker).post(
	validateBody({
		type: "object",
		properties: {
			name: ValidatePricingPlan.name,
			description: ValidatePricingPlan.description,
			paypalPlanId: ValidatePricingPlan.paypalPlanId,
			price: ValidatePricingPlan.price,
			caption: ValidatePricingPlan.caption,
			numberOfPodcasts: ValidatePricingPlan.numberOfPodcasts,
			features: ValidatePricingPlan.features
		},
		required: [
			"name",
			"description",
			"paypalPlanId",
			"price",
			"caption",
			"numberOfPodcasts",
			"features"
		],
		additionalProperties: true
	}),
	async (req, res) => {
		const {
			name,
			description,
			paypalPlanId,
			price,
			caption,
			numberOfPodcasts,
			discountedPrice,
			features
		} = req.body
		try {
			const planId = await addPricingPlan({
				creatorId: req.user._id,
				name,
				description,
				paypalPlanId,
				price,
				discountedPrice,
				caption,
				numberOfPodcasts,
				features
			})
			return res.json(planId)
		} catch (e) {
			return res.status(500).end()
		}
	}
)

export default router.handler(ncRouteHandlerOpts)
