import { fetcher } from "@/lib/app/fetch"
import React from "react"
import useSWR, { useSWRConfig } from "swr"

export function useUser(id) {
	const { data, error } = useSWR(id ? `/api/users/${id}` : null, fetcher)

	return {
		user: data,
		error,
		loading: !data && !error
	}
}

export function useCurrentUser() {
	const { data, error } = useSWR(`/api/user`, fetcher)

	return {
		user: data,
		error,
		loading: !data && !error
	}
}

export function useRandomCurrentUser() {
	const random = React.useRef(Date.now())
	const { data, error } = useSWR([`/api/user`, random], fetcher)

	return {
		user: data,
		error,
		loading: !data && !error
	}
}

export function useUserMutator(id) {
	const { mutate } = useSWRConfig()
	const url = id ? `/api/users/${id}` : `/api/user`

	function updateUser(updatedUser) {
		mutate(url, async () => updatedUser, false)
	}

	return {
		updateUser
	}
}

export function useUsers(userType) {
	const url = userType ? `/api/users?userType=${userType}` : `/api/users`

	const { data, error } = useSWR(url, fetcher)
	return {
		users: data,
		error,
		loading: !data && !error
	}
}

export function useUsersMutator() {
	const { mutate } = useSWRConfig()
	const url = `/api/users`

	function addUser(user) {
		mutate(
			url,
			async users => {
				return [user, ...users]
			},
			false
		)
	}

	function updateUser(updatedUser) {
		mutate(url, async users =>
			users.map(user => {
				return user._id === updatedUser._id ? updatedUser : user
			})
		)
	}

	function deleteUser(id) {
		mutate(url, async users => users.filter(user => user._id !== id), false)
	}

	return {
		addUser,
		updateUser,
		deleteUser
	}
}

export function useFollowedPodcast(podcastId, user) {
	const { data, error } = useSWR(
		podcastId && user ? `/api/podcasts/${podcastId}/follow` : null,
		fetcher
	)

	return {
		podcast: data,
		error,
		loading: !data && !error
	}
}

export function useFollowedPodcastMutator(podcastId) {
	const { mutate } = useSWRConfig()
	const url = `/api/podcasts/${podcastId}/follow`

	function followPodcast(podcast) {
		mutate(
			url,
			async item => {
				return { ...item, podcast }
			},
			false
		)
	}

	function unfollowPodcast() {
		mutate(
			url,
			async () => {
				return {}
			},
			false
		)
	}

	return {
		followPodcast,
		unfollowPodcast
	}
}

export function useUserCount(role) {
	const { data, error } = useSWR(
		`/api/users/user-count?userType=${role}`,
		fetcher
	)

	return {
		userCount: data?.userCount,
		error,
		loading: !data && !error
	}
}
