import { fetcher } from "../fetch"

export async function addPricingPlan(data) {
	return await fetcher("/api/pricing", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function editPricingPlan(id, data) {
	return await fetcher(`/api/pricing/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function deletePricingPlan(id) {
	await fetcher(`/api/pricing/${id}`, {
		method: "DELETE"
	})
}
