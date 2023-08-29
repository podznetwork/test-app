import { getAdminUser } from "@/lib/api/db"
import {
	addConversation,
	addMessage,
	getConversationBySenderAndReceiverId
} from "@/lib/api/db/conversation"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker)

router.post(async (req, res) => {
	const { message } = req.body
	const admin = await getAdminUser()
	try {
		const conversationObj = await getConversationBySenderAndReceiverId({
			senderId: req.user._id,
			receiverId: admin._id
		})

		let conversationId = conversationObj?._id

		if (!conversationId) {
			conversationId = await addConversation({
				senderId: req.user._id,
				receiverId: admin._id
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
