// import { findUserById } from "@/lib/api/db"
import { addRequest, getRequestByUserId } from "@/lib/api/db/requests"
// import { sendMail } from "@/lib/api/mail"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(tokenChecker, database)

router.get(async (req, res) => {
	try {
		const request = await getRequestByUserId(req.user._id, req.query.role)
		res.json(request)
	} catch (e) {
		res.status(500).end()
	}
})

router.post(async (req, res) => {
	try {
		const data = { ...req.body }
		delete data._id
		const requestId = await addRequest(req.body._id, data)
		// const user = await findUserById(req.body._id)

		// await sendMail({
		// 	to: user.email,
		// 	from: process.env.FROM_EMAIL,
		// 	subject: `Added as a ${req.body.role} at Podz Network`,
		// 	html: `
		// 	<div>
		// 	  <p>Hello</p>
		// 		<p>Hello ${user.name},</p>
		// 		<p>You have been added as a ${req.body.role} at Podz Network.</p>
		// 	</div>
		// 	`
		// })

		res.json(requestId)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
