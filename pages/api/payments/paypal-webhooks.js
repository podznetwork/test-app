import { updateUserById } from "@/lib/api/db"
import { getUserBySubscriptionId } from "@/lib/api/db/payment"
import { updateOwnerRequestByUserId } from "@/lib/api/db/requests"
import { sendMail } from "@/lib/api/mail"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()
router.use(database)

//Receive failed payments web-hook
router.post(async (req, res) => {
	try {
		const subscriptionId = req.body.resource.id
		const user = getUserBySubscriptionId(subscriptionId)
		await updateOwnerRequestByUserId(user._id, {
			status: "approved"
		})
		await updateUserById(user._id, {
			access: user?.access?.filter(level => level !== "owner"),
			plan: null,
			subscriptionId: null
		})

		await sendMail({
			to: user.email,
			from: process.env.FROM_EMAIL,
			subject: `Payment for Subscription Failed at Podz`,
			html: `
				<div>
					<p>Hello, ${user.name}</p>
					<p>Your payment for monthly subscription at Podz failed due to some reason.</p>
					<p>So your access has been restricted for now. Please subscribe again to resume your activities as an awesome podcaster at Podz Network.</p>
					<p>If you have any questions or concerns, please do not hesitate to contact us.</p>
					<p>Best regards,</p>
					<p>Podz Network Team</p>
				</div>
		  `
		})
	} catch (e) {
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
