import useSWR, { useSWRConfig } from "swr"
import { fetcher } from "../fetch"

export function useMediaZ(podcastId) {
	const { data, error } = useSWR(
		podcastId ? `/api/mediaz?podcast=${podcastId}` : null,
		fetcher
	)

	return {
		mediaz: data,
		error,
		loading: !data && !error
	}
}

export function useAllMediaZ() {
	const { data, error } = useSWR(`/api/mediaz/all-media`, fetcher)

	return {
		mediaz: data,
		error,
		loading: !data && !error
	}
}

export function useMediaZMutator(podcastId) {
	const { mutate } = useSWRConfig()
	const url = `/api/mediaz?podcast=${podcastId}`

	function addMedia(media) {
		mutate(url, async mediaz => [...mediaz, media], false)
	}

	function updateMedia(updatedMedia) {
		mutate(
			url,
			async mediaz =>
				mediaz.map(media => {
					return media._id === updatedMedia._id ? updatedMedia : media
				}),
			false
		)
	}

	function deleteMedia(mediaId) {
		mutate(url, async mediaz =>
			mediaz.filter(media => media._id !== mediaId)
		)
	}

	return {
		addMedia,
		updateMedia,
		deleteMedia
	}
}
