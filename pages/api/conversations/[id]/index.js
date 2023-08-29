import {
	addMessage,
	getConversation,
	updateConversationStatus
} from "@/lib/api/db/conversation"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	try {
		const conversation = await getConversation(req.query.id)
		return res.json(conversation[0])
	} catch (e) {
		return res.status(500).end()
	}
})

router.post(async (req, res) => {
	const { message } = req.body
	try {
		const conversation = await addMessage({
			conversationId: req.query.id,
			senderId: req.user._id,
			message
		})

		return res.json(conversation)
	} catch (e) {
		return res.status(500).end()
	}
})

router.put(async (req, res) => {
	const { status } = req.body
	try {
		const conversation = await updateConversationStatus({
			id: req.query.id,
			status,
			userId: req.user._id
		})

		return res.json(conversation)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
