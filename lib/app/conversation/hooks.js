import useSWR, { useSWRConfig } from "swr"
import { fetcher } from "../fetch"

export function useConversations() {
	const { data, error } = useSWR(`/api/conversations`, fetcher)

	return {
		conversations: data,
		error,
		loading: !data && !error
	}
}

export function useConversationsNewMessages() {
	const { data, error } = useSWR(`/api/conversations/count`, fetcher)

	console.log(data)

	return {
		newMessages: data,
		error,
		loading: !data && !error
	}
}

export function useConversationsMutator() {
	const { mutate } = useSWRConfig()
	const url = `/api/conversations`

	function addConversation(conversation) {
		mutate(url, async conversations => {
			return [...conversations, conversation]
		})
	}

	function updateConversation(updatedConversation) {
		mutate(url, async conversations => {
			return conversations
		})
	}

	return {
		addConversation,
		updateConversation
	}
}
