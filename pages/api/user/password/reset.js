import {
	createToken,
	findAndDeleteTokenByIdAndType,
	findUserByEmail,
	UNSAFE_updateUserPassword
} from "@/lib/api/db"
import { sendMail } from "@/lib/api/mail"
import { database, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidateUser } from "@/lib/api/validation/user"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.post(
	validateBody({
		type: "object",
		properties: {
			email: ValidateUser.email
		},
		required: ["email"],
		additionalProperties: false
	}),
	async (req, res) => {
		const email = String(req.body.email).toLowerCase()
		const user = await findUserByEmail(email)
		if (!user) {
			res.status(400).json({
				error: {
					message: "We couldn’t find that email. Please try again."
				}
			})
			return
		}

		const token = await createToken({
			creatorId: user._id,
			type: "passwordReset",
			expireAt: new Date(Date.now() + 1000 * 60 * 20)
		})

		await sendMail({
			to: email,
			from: process.env.FROM_EMAIL,
			subject: "Reset your password on Podz Network",
			html: `
      <div>
        <p>Hello, ${user.name}</p>
		
        <p>We have received a request to reset the password for your account on Podz Network. If you did not initiate this request, please ignore this email and your password will remain unchanged.</p>
		
        <p>To reset your password, please click on <a href="${process.env.NEXT_PUBLIC_WEB_URI}/forget-password/${token._id}">this link.</a></p>
		
        <p>You will then be prompted to create a new password for your account. Once you have reset your password, you can use it to log in to your account and access our content.</p>
		
        <p>If you have any questions or concerns, please do not hesitate to contact us.</p>
		
        <p>Best regards,</p>
		
        <p>Podz Network Team</p>
		
        <p>P.S. Please note that this link will expire in 24 hours, after that you will need to request a new password reset link.</p>
      </div>
      `
		})

		res.status(204).end()
	}
)

router.put(
	validateBody({
		type: "object",
		properties: {
			password: ValidateUser.password,
			token: { type: "string", minLength: 0 }
		},
		required: ["password", "token"],
		additionalProperties: false
	}),
	async (req, res) => {
		const deletedToken = await findAndDeleteTokenByIdAndType(
			req.body.token,
			"passwordReset"
		)
		if (!deletedToken) {
			res.status(403).end()
			return
		}
		await UNSAFE_updateUserPassword(
			deletedToken.creatorId,
			req.body.password
		)
		res.status(204).end()
	}
)

export default router.handler(ncRouteHandlerOpts)
