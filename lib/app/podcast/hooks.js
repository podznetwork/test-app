import useSWR, { useSWRConfig } from "swr"
import { fetcher } from "../fetch"

export function usePublicPodcasts(userId) {
	const { data, error } = useSWR(
		userId ? `/api/podcasts/public?userId=${userId}` : null,
		fetcher
	)

	return {
		podcasts: data,
		error,
		loading: !data && !error
	}
}

export function usePodcasts() {
	const { data, error } = useSWR(`/api/podcasts`, fetcher)

	return {
		podcasts: data,
		error,
		loading: !data && !error
	}
}

export function usePublicHostPodcasts(userId) {
	const { data, error } = useSWR(
		userId ? `/api/podcasts/public/host-podcasts?userId=${userId}` : null,
		fetcher
	)

	return {
		podcasts: data,
		error,
		loading: !data && !error
	}
}

export function useHostPodcasts() {
	const { data, error } = useSWR(`/api/podcasts/host-podcasts`, fetcher)

	return {
		podcasts: data,
		error,
		loading: !data && !error
	}
}

export function useHostPodcastsMutator() {
	const { mutate } = useSWRConfig()
	const url = `/api/podcasts/host-podcasts`

	function updatePodcast(updatedPodcast) {
		mutate(url, async podcasts =>
			podcasts.map(podcast => {
				return podcast._id === updatedPodcast._id
					? updatedPodcast
					: podcast
			})
		)
	}

	return {
		updatePodcast
	}
}

export function usePodcast(id) {
	const { data, error } = useSWR(id ? `/api/podcasts/${id}` : null, fetcher)

	return {
		podcast: data,
		error,
		loading: !data && !error
	}
}

export function usePodcastsMutator(option = "") {
	const { mutate } = useSWRConfig()
	const url = `/api/podcasts${option}`

	function addPodcast(podcast) {
		mutate(url, async podcasts => [podcast, ...podcasts], false)
	}

	function updatePodcast(updatedPodcast) {
		mutate(url, async podcasts =>
			podcasts.map(podcast => {
				return podcast._id === updatedPodcast._id
					? updatedPodcast
					: podcast
			})
		)
	}

	function deletePodcast(id) {
		mutate(url, async podcasts =>
			podcasts.filter(podcast => podcast._id !== id)
		)
	}

	return {
		addPodcast,
		updatePodcast,
		deletePodcast
	}
}

export function useAllPodcasts(featured = null, limit = null) {
	let url
	if (featured || limit) {
		if (featured) {
			url = `/api/podcasts/all-podcasts?featured=true`
		} else if (limit) {
			url = `/api/podcasts/all-podcasts?limit=${limit}`
		}
	} else {
		url = `/api/podcasts/all-podcasts`
	}

	const { data, error } = useSWR(url, fetcher)

	return {
		podcasts: data,
		error,
		loading: !data && !error
	}
}

export function useFollowedPodcasts(id) {
	const { data, error } = useSWR(
		id ? `/api/podcasts/followed/${id}` : `/api/podcasts/followed`,
		fetcher
	)

	return {
		podcasts: data,
		error,
		loading: !data && !error
	}
}

export function useFollowedPodcastsMutator() {
	const { mutate } = useSWRConfig()
	const url = `/api/podcasts/followed`

	function unfollowPodcast(id) {
		mutate(url, async podcasts =>
			podcasts.filter(podcast => podcast._id !== id)
		)
	}

	return {
		unfollowPodcast
	}
}
