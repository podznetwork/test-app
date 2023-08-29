import useSWR, { useSWRConfig } from "swr"
import { fetcher } from "../fetch"

export function useEpisodes({ page, itemsPerPage = 10 }) {
	let url
	if (page === 0 || page) {
		url = `/api/episodes?page=${page}&limit=${itemsPerPage}`
	} else if (itemsPerPage) {
		url = `/api/episodes?limit=${itemsPerPage}`
	} else {
		url = `/api/episodes`
	}
	const { data, error } = useSWR(url, fetcher)
	return {
		episodesData: data,
		error,
		loading: !data && !error
	}
}

export function useEpisode(id) {
	const { data, error } = useSWR(id ? `/api/episodes/${id}` : null, fetcher)

	return {
		episode: data,
		error,
		loading: !data && !error
	}
}

export function usePreviousEpisodes(id, limit) {
	const { data, error } = useSWR(
		id ? `/api/episodes/${id}/prevEpisodes?limit=${limit}` : null,
		fetcher
	)

	return {
		episodes: data,
		error,
		loading: !data && !error
	}
}

export function useEpisodeGuests(id) {
	const { data, error } = useSWR(
		id ? `/api/episodes/${id}/guests` : null,
		fetcher
	)

	return {
		guests: data,
		error,
		loading: !data && !error
	}
}

export function usePublicGuestEpisodes(userId) {
	const { data, error } = useSWR(
		userId ? `/api/episodes/public/guest-podcasts?userId=${userId}` : null,
		fetcher
	)

	return {
		episodes: data,
		error,
		loading: !data && !error
	}
}

export function useOwnerEpisodes({ page, itemsPerPage = 10 }) {
	const url = `/api/episodes/owner-episodes?page=${page}&limit=${itemsPerPage}`

	const { data, error } = useSWR(url, fetcher)
	return {
		episodesData: data,
		error,
		loading: !data && !error
	}
}

export function usePodcastEpisodes(podcastId, page, itemsPerPage = 10) {
	const url =
		page === 0 || page
			? `/api/episodes/podcast-episodes?podcastId=${podcastId}&page=${page}&limit=${itemsPerPage}`
			: `/api/episodes/podcast-episodes?podcastId=${podcastId}`

	const { data, error } = useSWR(podcastId ? url : null, fetcher)

	return {
		episodesData: data,
		error,
		loading: !data && !error
	}
}
export function useEpisodeMutator(id) {
	const { mutate } = useSWRConfig()
	const url = `/api/episodes/${id}`

	function editEpisode(updatedEpisode) {
		mutate(
			url,
			async prevEpisode => {
				const updatedGuestIds = updatedEpisode.guests.map(
					guest => guest._id
				)
				return {
					...prevEpisode,
					...updatedEpisode,
					guestUsers: prevEpisode.guestUsers.filter(guest =>
						updatedGuestIds.includes(guest._id)
					)
				}
			},
			false
		)
	}

	function deleteEpisode() {
		mutate(url, null, false)
	}

	return {
		editEpisode,
		deleteEpisode
	}
}

export function useEpisodesMutator(podcastId, page, itemsPerPage = 10) {
	const { mutate } = useSWRConfig()
	let url
	if (podcastId) {
		url = `/api/episodes/podcast-episodes?podcastId=${podcastId}&page=${page}&limit=${itemsPerPage}`
	} else {
		url = `/api/episodes`
	}

	function addEpisodes(episodes) {
		mutate(
			url,
			async prevEpisodes => {
				return {
					...prevEpisodes,
					episodes: [
						// eslint-disable-next-line no-unsafe-optional-chaining
						...prevEpisodes?.episodes,
						...episodes
					].slice(0, itemsPerPage)
				}
			},
			false
		)
	}

	function editEpisode(updatedEpisode) {
		mutate(url, async prevEpisodes => {
			return {
				...prevEpisodes,
				episodes: prevEpisodes?.episodes.map(episode => {
					return episode._id === updatedEpisode._id
						? updatedEpisode
						: episode
				})
			}
		}),
			false
	}

	function deleteAllEpisodes(podcastId) {
		mutate(url, async prevEpisodes => {
			return {
				...prevEpisodes,
				episodes: prevEpisodes?.episodes.map(episode => {
					if (episode.podcast !== podcastId) {
						return episode
					}
				})
			}
		})
	}

	function deleteEpisode(id) {
		mutate(url, async prevEpisodes => {
			return {
				...prevEpisodes,
				episodes: prevEpisodes.episodes.filter(
					episode => episode._id !== id
				)
			}
		})
	}
	return {
		addEpisodes,
		editEpisode,
		deleteEpisode,
		deleteAllEpisodes
	}
}
