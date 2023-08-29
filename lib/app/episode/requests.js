import { fetcher } from "../fetch"

export async function deleteEpisode(id) {
	await fetcher(`/api/episodes/${id}`, {
		method: "DELETE"
	})
}

export async function updateEpisode(id, data) {
	return await fetcher(`/api/episodes/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
