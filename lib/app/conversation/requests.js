import { fetcher } from "../fetch"

export async function createConversation(data) {
	return await fetcher("/api/conversations", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function sendMessage(id, data) {
	return await fetcher(`/api/conversations/${id}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function sendAdminMessage(data) {
	return await fetcher("/api/conversations/admin", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function updateConversationStatus(id, data) {
	return await fetcher(`/api/conversations/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
