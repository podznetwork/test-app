import useSWR, { useSWRConfig } from "swr"
import { fetcher } from "../fetch"

export function useRequests() {
	const { data, error } = useSWR(`/api/requests`, fetcher)

	return {
		requests: data,
		error,
		loading: !data && !error
	}
}

export function useRequestsMutator() {
	const { mutate } = useSWRConfig()
	const url = "/api/requests"

	function updateRequest(updatedRequest) {
		mutate(url, async requests =>
			requests.map(request => {
				return request._id === updatedRequest._id
					? updateRequest
					: request
			})
		)
	}

	function removeRequest(id) {
		mutate(url, async requests =>
			requests.filter(request => request._id !== id)
		)
	}

	return {
		updateRequest,
		removeRequest
	}
}

export function useRequest(role) {
	const { data, error } = useSWR(
		role ? `/api/requests/single-request?role=${role}` : null,
		fetcher
	)

	return {
		request: data,
		error,
		loading: !data && !error
	}
}

export function useRequestMutator(role) {
	const { mutate } = useSWRConfig()
	const url =
		role === "owner"
			? `/api/requests/single-request?role=owner`
			: `/api/requests/single-request?role=guest`

	function addRequest(request) {
		mutate(url, async () => request, false)
	}

	function updateRequest(updatedRequest) {
		mutate(url, async request => ({
			...updatedRequest,
			request
		}))
	}

	return {
		addRequest,
		updateRequest
	}
}

export function useUserRequest(id, role) {
	const { data, error } = useSWR(
		id && role ? `/api/requests/user?userId=${id}&role=${role}` : null,
		fetcher
	)

	return {
		request: data,
		error,
		loading: !data && !error
	}
}
