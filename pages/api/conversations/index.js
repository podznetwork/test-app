import {
	addConversation,
	addMessage,
	getConversationBySenderAndReceiverId,
	getConversations
} from "@/lib/api/db/conversation"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	try {
		const conversations = await getConversations({ senderId: req.user._id })
		return res.json(conversations)
	} catch (e) {
		return res.status(500).end()
	}
})

router.post(async (req, res) => {
	const { receiverId, message } = req.body
	try {
		const conversationObj = await getConversationBySenderAndReceiverId({
			senderId: req.user._id,
			receiverId
		})

		let conversationId = conversationObj?._id

		if (!conversationId) {
			conversationId = await addConversation({
				senderId: req.user._id,
				receiverId
			})
		}

		const conversation = await addMessage({
			conversationId,
			senderId: req.user._id,
			message
		})

		return res.json(conversation)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
