import { updateUserById } from "@/lib/api/db"
import { addRequest, getRequests } from "@/lib/api/db/requests"
import { sendMail } from "@/lib/api/mail"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(tokenChecker, database)

router.get(async (req, res) => {
	try {
		const requests = await getRequests()
		res.json(requests)
	} catch (e) {
		res.status(500).end()
	}
})

router.post(async (req, res) => {
	try {
		const requestId = await addRequest(req.user._id, req.body)

		await sendMail({
			to: process.env.FROM_EMAIL,
			from: process.env.FROM_EMAIL,
			subject: `Request for ${req.body.role} at Podz`,
			html: `
			<div>
			  <p>Hello</p>
				<p>The user ${req.user.name} has requested for ${req.body.role} at Podz. Please look into the request.</p>
			</div>
			`
		})

		res.json(requestId)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

//Allow the user to change becomeHost field
router.put(async (req, res) => {
	const { becomeHost } = req.body
	try {
		const user = await updateUserById(req.user._id, { becomeHost })

		return res.json(user)
	} catch (e) {
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
