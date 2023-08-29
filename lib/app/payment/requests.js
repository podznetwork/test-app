import { fetcher } from "../fetch"

export async function addPayment(data) {
	return await fetcher("/api/payments", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function createSubscriptionPlan(data) {
	return await fetcher("/api/payments/paypal", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function updateSubscriptionPricing(data) {
	return await fetcher("/api/payments/paypal", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function getSubscription(id) {
	return await fetcher(`/api/payments/paypal/subscription?id=${id}`)
}

export async function refundUser(data) {
	return await fetcher("/api/payments/paypal/subscription", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function cancelSubscription(data, sendEmail) {
	await fetcher("/api/payments/paypal", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})

	return await fetcher(`/api/payments?sendEmail=${sendEmail}`, {
		method: "DELETE"
	})
}

export async function refundUser__Server(data) {
	return await fetcher(`${process.env.PAYPAL_API}/v1/payments/payouts`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
			).toString("base64")}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
}

export async function createSubscriptionPlan__server(data) {
	return await fetcher(`${process.env.PAYPAL_API}/v1/billing/plans`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
			).toString("base64")}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
}

export async function updateSubscriptionPricing__server(planId, data) {
	return await fetcher(
		`${process.env.PAYPAL_API}/v1/billing/plans/${planId}/update-pricing-schemes`,
		{
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
				).toString("base64")}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}
	)
}

export async function getSubscription__server(id) {
	return await fetcher(
		`${process.env.PAYPAL_API}/v1/billing/subscriptions/${id}`,
		{
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
				).toString("base64")}`
			}
		}
	)
}

export async function cancelSubscription__server(id, data) {
	await fetcher(
		`${process.env.PAYPAL_API}/v1/billing/subscriptions/${id}/cancel`,
		{
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
				).toString("base64")}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}
	)
}
