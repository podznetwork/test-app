import { findUserById, updateUserById } from "@/lib/api/db"
import { addAdminMessage } from "@/lib/api/db/conversation"
import { deleteRequest, updateRequest } from "@/lib/api/db/requests"
import { sendMail } from "@/lib/api/mail"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(tokenChecker, database)

router.put(async (req, res) => {
	try {
		const user = await findUserById(req.user._id)
		const { status, role, access, userId } = req.body
		const request = await updateRequest(req.query.id, req.body)
		const requestUser = await findUserById(request.userId)

		if (status === "declined") {
			await sendMail({
				to: user.email,
				from: process.env.FROM_EMAIL,
				subject: `${request.role} request declined`,
				html: `
                    <div>
                    <p>Hello, ${user.name}</p>
                    
                    <p>Unfortunately, your ${request.role} request at Podz Network has been declined due to some reasons.</p>
                    
                    <p>If you have any questions or concerns, please do not hesitate to contact us.</p>
                    
                    <p>Best regards,</p>
                    
                    <p>Podz Network Team</p>
                  </div>
                    `
			})

			await addAdminMessage(
				userId,
				"Congratulations, your guest request at Podz Network has been approved. We have automatically updated your profile bio with your guest request biography. Consequently, your biography has been updated."
			)
		}

		if (role === "guest" && user.access.includes("admin")) {
			await updateUserById(userId, {
				access: [...access, "guest"],
				bio: request.biography
			})
			await sendMail({
				to: user.email,
				from: process.env.FROM_EMAIL,
				subject: "Updated biography at request approval",
				html: `
                    <div>
                    <p>Hello, ${requestUser.name}</p>
                    
                    <p>Congratulations, your guest request at Podz Network has been approved. We have automatically updated your profile bio with your guest request biography. Consequently, your biography has been updated.</p>
                    
                    <p>If you have any questions or concerns, please do not hesitate to contact us.</p>
                    
                    <p>Best regards,</p>
                    
                    <p>Podz Network Team</p>
                  </div>
                    `
			})

			await addAdminMessage(
				request.userId,
				"Congratulations, your guest request at Podz Network has been approved. We have automatically updated your profile bio with your guest request biography. Consequently, your biography has been updated."
			)
		}

		if (role === "owner" && user.access.includes("admin")) {
			await sendMail({
				to: user.email,
				from: process.env.FROM_EMAIL,
				subject: "Podcast Owner request approved",
				html: `
                    <div>
                    <p>Hello, ${requestUser.name}</p>
                    
                    <p>Congratulations, your podcast owner request at Podz Network has been approved. However, you are still required to pay before you can enjoy all the benefits. We are looking forward to seeing you as an awesome podcaster soon!</p>
                    
                    <p>If you have any questions or concerns, please do not hesitate to contact us.</p>
                    
                    <p>Best regards,</p>
                    
                    <p>Podz Network Team</p>
                  </div>
                    `
			})

			await addAdminMessage(
				request.userId,
				"Congratulations, your podcast owner request at Podz Network has been approved. However, you are still required to pay before you can enjoy all the benefits. We are looking forward to seeing you as an awesome podcaster soon!"
			)
		}
		res.json(request)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

router.delete(async (req, res) => {
	try {
		const request = await deleteRequest(req.query.id)
		res.json(request)
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
