import { fetcher } from "../fetch"

export async function addImage(data) {
	return await fetcher("/api/gallery", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export async function editImage(id, edit) {
	return await fetcher(`/api/gallery/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(edit)
	})
}

export async function deleteImage(id) {
	await fetcher(`/api/gallery/${id}`, {
		method: "DELETE"
	})
}
