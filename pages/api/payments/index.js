import { findUserById, updateUserById } from "@/lib/api/db"
import { addPayment } from "@/lib/api/db/payment"
import {
	updateOwnerRequestByUserId,
	updateRequest
} from "@/lib/api/db/requests"
import { sendMail } from "@/lib/api/mail"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(tokenChecker, database)

router.post(async (req, res) => {
	const { amount, pricingPlan, requestId, orderId } = req.body
	try {
		const user = await findUserById(req.user._id)

		const paymentId = await addPayment({
			orderId,
			userId: req.user._id,
			amount,
			pricingPlan
		})

		let updatedUser
		let updatedRequest
		if (paymentId && !user.access.includes("owner")) {
			updatedRequest = await updateRequest(requestId, { status: "paid" })

			updatedUser = await updateUserById(req.user._id, {
				access: [...user.access, "owner"]
			})
		}

		await sendMail({
			to: user.email,
			from: process.env.FROM_EMAIL,
			subject: `Successful subscription to plan`,
			html: `
				<div>
					<p>Hello, ${user.name}</p>
					<p>Thank you for your subscription to Podz Network.</p>
					<p>We are very excited to have you aboard as a Podcaster and are looking forward to your awesome content.</p>
					<p>If you have any questions or concerns, please do not hesitate to contact us.</p>
					<p>Best regards,</p>
					<p>Podz Network Team</p>
				</div>
		  `
		})

		res.json({ paymentId, updatedRequest, updatedUser })
	} catch (e) {
		res.status(500).end()
	}
})

router.delete(async (req, res) => {
	try {
		const user = await findUserById(req.user._id)
		const sendEmail = req.query.sendEmail

		let updatedRequest
		let updatedUser
		if (user.access.includes("owner")) {
			updatedRequest = await updateOwnerRequestByUserId(req.user._id, {
				status: "approved"
			})

			updatedUser = await updateUserById(req.user._id, {
				access: user?.access?.filter(level => level !== "owner"),
				plan: null,
				subscriptionId: null
			})
		}

		if (sendEmail && sendEmail === "true") {
			await sendMail({
				to: user.email,
				from: process.env.FROM_EMAIL,
				subject: `Subscription Cancellation at Podz Network`,
				html: `
					<div>
						<p>Hello, ${user.name}</p>
						<p>You have unsubscribed from podcaster access. We are sorry to not see you as a podcaster anymore.</p>
						<p>There are many opportunities waiting for you and your listeners are just as eager as us to see you again.</p>
						<p>If you have any questions or concerns, please do not hesitate to contact us.</p>
						<p>Best regards,</p>
						<p>Podz Network Team</p>
					</div>
			  `
			})
		}

		res.json({ updatedRequest, updatedUser })
	} catch (e) {
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
