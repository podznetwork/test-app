import { fetcher } from "../fetch"

export async function addRequest(data) {
	return await fetcher("/api/requests", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function addRequestByAdmin(data) {
	return await fetcher("/api/requests/single-request", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function updateRequest(id, data) {
	return await fetcher(`/api/requests/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function updateUserRequest(id, data) {
	return await fetcher(`/api/requests/user?requestId=${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function deleteRequest(id) {
	return await fetcher(`/api/requests/${id}`, {
		method: "DELETE"
	})
}
