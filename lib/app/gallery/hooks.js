import useSWR, { useSWRConfig } from "swr"
import { fetcher } from "../fetch"

export function useGalleryImages() {
	const { data, error } = useSWR(`/api/gallery`, fetcher)
	return {
		images: data,
		error,
		loading: !data && !error
	}
}

export function useGalleryImagesMutator() {
	const { mutate } = useSWRConfig()
	const url = `/api/gallery`

	function addImage(image) {
		mutate(url, async images => [image, ...images], false)
	}

	function updateImage(id, updatedImage) {
		mutate(
			url,
			async images =>
				images.map(image => (image._id === id ? updatedImage : image)),
			false
		)
	}

	function deleteImage(id) {
		mutate(url, async images => images.filter(image => image._id !== id))
	}

	return {
		addImage,
		updateImage,
		deleteImage
	}
}
