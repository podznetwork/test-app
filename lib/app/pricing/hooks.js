const { default: useSWR, useSWRConfig } = require("swr")
const { fetcher } = require("../fetch")

export function usePricingPlans() {
	const { data, error } = useSWR(`/api/pricing`, fetcher)

	return {
		plans: data,
		error,
		loading: !data && !error
	}
}

export function usePricingPlansMutator() {
	const { mutate } = useSWRConfig()
	const url = `/api/pricing`

	function addPricingPlan(plan) {
		mutate(url, async plans => [plan, ...plans], false)
	}

	function updatePricingPlan(updatedPlan) {
		mutate(
			url,
			async plans =>
				plans.map(plan => {
					return plan._id === updatedPlan._id ? updatedPlan : plan
				}),
			false
		)
	}

	function deletePricingPlan(id) {
		mutate(url, async plans => plans.filter(plan => plan._id !== id))
	}

	return {
		addPricingPlan,
		updatePricingPlan,
		deletePricingPlan
	}
}
