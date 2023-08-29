// import { findUserById } from "@/lib/api/db"
import {
	addRequest,
	getRequestByUserId,
	updateRequest
} from "@/lib/api/db/requests"
// import { sendMail } from "@/lib/api/mail"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(tokenChecker, database)

router.get(async (req, res) => {
	try {
		const { userId, role } = req.query
		const request = await getRequestByUserId(userId, role)
		res.json(request)
	} catch (e) {
		res.status(500).end()
	}
})

router.put(async (req, res) => {
	try {
		const { requestId } = req.query
		const request = await updateRequest(requestId, req.body)
		res.json(request)
	} catch (e) {
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
