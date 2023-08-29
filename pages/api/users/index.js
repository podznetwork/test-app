import {
	addUser,
	createToken,
	findUserByEmail,
	findUserByUsername,
	getUsers,
	getUsersByRole
} from "@/lib/api/db"
import { sendMail } from "@/lib/api/mail"
import { database, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidateUser } from "@/lib/api/validation/user"
import { slugUsername } from "@/lib/app/user"
import { createRouter } from "next-connect"
import isEmail from "validator/lib/isEmail"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	try {
		const userType = req.query.userType
		let users
		if (userType) {
			users = await getUsersByRole({ userType })
		} else {
			users = await getUsers()
		}
		return res.json(users)
	} catch (e) {
		return res.status(500).end()
	}
})

router.post(
	validateBody({
		type: "object",
		properties: {
			username: ValidateUser.username,
			name: ValidateUser.name,
			password: ValidateUser.password,
			email: ValidateUser.email,
			role: ValidateUser.role,
			captcha: ValidateUser.captcha
		},
		required: ["role", "password", "email", "name", "username"],
		additionalProperties: false
	}),
	async (req, res) => {
		let { email, password, role, name, username, captcha } = req.body
		username = slugUsername(req.body.username)
		email = String(req.body.email).toLowerCase()
		if (!isEmail(email)) {
			if (!captcha) {
				return res.status(422).json({
					message:
						"Unproccesable request, please provide the required fields"
				})
			}
			return res.status(400).json({
				error: { message: "The email you entered is invalid." }
			})
		}
		if (await findUserByEmail(email)) {
			return res.status(403).json({
				error: { message: "The email has already been used." }
			})
		}
		if (await findUserByUsername(username)) {
			return res.status(403).json({
				error: { message: "The username has already been taken." }
			})
		}
		const response = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
			{
				headers: {
					"Content-Type":
						"application/x-www-form-urlencoded; charset=utf-8"
				},
				method: "POST"
			}
		)
		const captchaValidation = await response.json()
		if (captchaValidation.success) {
			const userId = await addUser({
				username,
				name,
				email,
				originalPassword: password,
				bio: "",
				role
			})

			const token = await createToken({
				creatorId: userId,
				type: "emailVerify",
				expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
			})

			await sendMail({
				to: email,
				from: process.env.FROM_EMAIL,
				subject: `Verify your account on Podz Network`,
				html: `
        <p>Hello, ${name}</p>
        <p>Welcome to Podz Network! We are excited to have you on board and to provide you with access to our wide range of podcasts and services.
		</p>
        <p>In order to complete your registration and activate your account, we need you to verify your email address by clicking on <a href="${process.env.NEXT_PUBLIC_WEB_URI}/verify-email/${token._id}">this link.</a></p>
        <p>Once you have verified your email, you will be able to access your account, create and manage your profile, and access our content.
		</p>
		
        <p>If you did not sign up for an account on Podz Network or if you have any questions or concerns, please do not hesitate to contact us.</p>
        <p>Best regards,</p>
        <p>Podz Network Team</p>
        <p>P.S. Please note that this link will expire in 24 hours, after that you will need to request a new password reset link.</p>
      </div>
			  `
			})

			return res.json({ id: userId })
		}
		return res.status(422).json({
			message: "Unproccesable request, Invalid captcha code"
		})
	}
)

export default router.handler(ncRouteHandlerOpts)
