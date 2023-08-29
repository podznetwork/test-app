import { getConversations } from "@/lib/api/db/conversation"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	try {
		const conversations = await getConversations({
			senderId: req.user._id
		})

		let newMessageField = false
		for (let i = 0; i < conversations.length; i++) {
			if (conversations[i].newMessage) {
				newMessageField = true
			}
		}

		if (newMessageField) {
			return res.json(conversations)
		} else {
			return res.json([])
		}
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
