export const ValidatePricingPlan = {
	name: { type: "string", minLength: 1, maxLength: 50 },
	description: { type: "string", minLength: 1, maxLength: 500 },
	paypalPlanId: { type: "string", minLength: 1, maxLength: 500 },
	price: { type: "number", minimum: 0 },
	discountedPrice: { type: "number", minimum: 0 },
	caption: { type: "string", minLength: 1, maxLength: 500 },
	numberOfPodcasts: {
		type: "number",
		minimum: 1
	},
	features: {
		type: "array",
		items: {
			type: "string",
			minLength: 1
		}
	}
}
