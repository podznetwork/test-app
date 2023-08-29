import { fetcher } from "../fetch"

export async function deleteMediaZ(id) {
	return await fetcher(`/api/mediaz/${id}`, {
		method: "DELETE"
	})
}
