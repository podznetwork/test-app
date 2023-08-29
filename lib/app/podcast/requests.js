import { fetcher } from "../fetch"

export async function addPodcast(data) {
	return await fetcher("/api/podcasts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function updatePodcast(id, data) {
	return await fetcher(`/api/podcasts/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function deletePodcast(id) {
	await fetcher(`/api/podcasts/${id}`, {
		method: "DELETE"
	})
}

export async function refetchEpisodes() {
	return await fetcher(`/api/podcasts/all-podcasts`, {
		method: "POST"
	})
}

export async function loadRssLink(data) {
	return await fetcher("/api/podcasts/rss-link", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function changePodcastHostStatus(podcastId, status) {
	return await fetcher("/api/podcasts/host-podcasts", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ podcastId, status })
	})
}

export async function declinePodcastHosting(podcastId) {
	return await fetcher("/api/podcasts/host-podcasts", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ podcastId })
	})
}
