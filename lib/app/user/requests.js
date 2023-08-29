import { signIn } from "next-auth/react"
import { fetcher } from "../fetch"

export async function signin(args) {
	return await signIn("credentials", {
		...args
	})
}

export async function editUserData(id, data) {
	return await fetcher(`/api/users/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function addPricingPlan(id, plan) {
	return await fetcher(`/api/users/${id}/plan`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(plan)
	})
}

export async function addAdminUser(data) {
	return await fetcher("/api/users/admin-added-user", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function updateUser(data) {
	return await fetcher("/api/users/admin-added-user", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function completeUserSignUp(id, data) {
	return await fetcher(`/api/users/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function approveUser(id) {
	return await fetcher(`/api/users/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ approved: true })
	})
}

export async function deleteUser(id) {
	await fetcher(`/api/users/${id}`, {
		method: "DELETE"
	})
}
export async function changeBecomeHostField(becomeHost) {
	return await fetcher(`/api/requests`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ becomeHost })
	})
}

export async function followPodcast(podcastId) {
	return await fetcher(`/api/podcasts/${podcastId}/follow`, {
		method: "PATCH"
	})
}

export async function unfollowPodcast(podcastId) {
	return await fetcher(`/api/podcasts/${podcastId}/follow?unfollow=true`, {
		method: "PATCH"
	})
}
