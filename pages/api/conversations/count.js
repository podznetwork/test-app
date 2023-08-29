import { getConversationsNewMessageCount } from "@/lib/api/db/conversation"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	const newMessages = await getConversationsNewMessageCount({
		senderId: req.user._id
	})

	return res.json(newMessages)
})

export default router.handler(ncRouteHandlerOpts)
