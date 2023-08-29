import {
	addAdminUser,
	createUserToken,
	findUserByEmail,
	updateUserById
} from "@/lib/api/db"
import { sendMail } from "@/lib/api/mail"
import { database, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidateAdminAddedUser } from "@/lib/api/validation/user"
import { createRouter } from "next-connect"
import isEmail from "validator/lib/isEmail"

const router = createRouter()

router.use(database)

router.put(
	validateBody({
		type: "object",
		properties: {
			name: ValidateAdminAddedUser.name,
			email: ValidateAdminAddedUser.email,
			role: ValidateAdminAddedUser.role,
			access: ValidateAdminAddedUser.access
		},
		required: ["name", "email", "role", "access"],
		additionalProperties: true
	}),
	async (req, res) => {
		let { id, name, email, role, access } = req.body

		try {
			const updatedUser = await updateUserById(id, {
				name,
				email,
				role,
				access
			})
			return res.json(updatedUser)
		} catch (e) {
			return res.status(500).end()
		}
	}
)

router.post(
	validateBody({
		type: "object",
		properties: {
			name: ValidateAdminAddedUser.name,
			email: ValidateAdminAddedUser.email,
			role: ValidateAdminAddedUser.role,
			access: ValidateAdminAddedUser.access
		},
		required: ["name", "email", "role", "access"],
		additionalProperties: false
	}),
	async (req, res) => {
		let { name, email, role, access } = req.body
		email = req.body.email
		if (!isEmail(email)) {
			return res.status(400).json({
				error: { message: "The email you entered is invalid." }
			})
		}
		if (await findUserByEmail(email)) {
			return res.status(403).json({
				error: { message: "The email has already been used." }
			})
		}

		const userId = await addAdminUser({ email, name, role, access })

		const token = await createUserToken({
			creatorId: userId,
			type: "userSignup",
			expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
			role
		})

		if (role === "editor") {
			await sendMail({
				to: email,
				from: process.env.FROM_EMAIL,
				subject: `Invitation to become an editor on Podz Network`,
				html: `
				<div>
				  <p>Hello</p>
				<p>We at Podz Network would like to extend an invitation for you to join our team as an editor. We have been following your work/expertise and we believe that you would be a valuable asset to our team.</p> 
				<p>As an editor, you will have the opportunity to review and edit the content on our network, help to ensure accuracy, and contribute to the overall quality of our podcasts.
				</p> 
				<p>If you are interested in this opportunity, please click the following link to accept the invitation: <a href="${process.env.NEXT_PUBLIC_WEB_URI}/register/${token._id}">${process.env.NEXT_PUBLIC_WEB_URI}/register/${token._id}</a>. You will be asked to log in to your account and provide some additional information about your qualifications and experience.
				</p> 
				<p>We look forward to working with you and creating valuable content for our audience.</p>  
				<p>Best regards,</p>  
				<p>Podz Network Team</p>  
				<p>P.S. If you have any questions or concerns, please do not hesitate to contact us.</p>  
				</div>
				`
			})
		}

		if (role === "guest") {
			await sendMail({
				to: email,
				from: process.env.FROM_EMAIL,
				subject: `Invitation to become a guest on Podz Network`,
				html: `
				<div>
				  <p>Hello</p>
				<p>We at Podz Network would like to extend an invitation for you to join our team as a guest. We have been following your work/expertise and we believe that you would be a valuable asset to our team.</p> 
				<p>If you are interested in this opportunity, please click the following link to accept the invitation: <a href="${process.env.NEXT_PUBLIC_WEB_URI}/register/${token._id}">${process.env.NEXT_PUBLIC_WEB_URI}/register/${token._id}</a>. You will be asked to log in to your account and provide some additional information about your qualifications and experience.
				</p> 
				<p>We look forward to working with you.</p>  
				<p>Best regards,</p>  
				<p>Podz Network Team</p>  
				<p>P.S. If you have any questions or concerns, please do not hesitate to contact us.</p>  
				</div>
				`
			})
		}

		if (role === "owner") {
			await sendMail({
				to: email,
				from: process.env.FROM_EMAIL,
				subject: `Invitation to become an owner on Podz Network`,
				html: `
				<div>
				  <p>Hello</p>
				<p>We at Podz Network would like to extend an invitation for you to join our team as an owner. We have been following your work/expertise and we believe that you would be a valuable asset to our team.</p> 
				<p>If you are interested in this opportunity, please click the following link to accept the invitation: <a href="${process.env.NEXT_PUBLIC_WEB_URI}/register/${token._id}">${process.env.NEXT_PUBLIC_WEB_URI}/register/${token._id}</a>. You will be asked to log in to your account and provide some additional information about your qualifications and experience.
				</p> 
				<p>We look forward to working with you.</p>  
				<p>Best regards,</p>  
				<p>Podz Network Team</p>  
				<p>P.S. If you have any questions or concerns, please do not hesitate to contact us.</p>  
				</div>
				`
			})
		}

		return res.json(userId)
	}
)

export default router.handler(ncRouteHandlerOpts)
