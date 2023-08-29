import { createToken } from "@/lib/api/db"
import { sendMail } from "@/lib/api/mail"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(tokenChecker, database)

router.post(async (req, res) => {
	const token = await createToken({
		creatorId: req.user._id,
		type: "emailVerify",
		expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
	})

	await sendMail({
		to: req.user.email,
		from: process.env.FROM_EMAIL,
		subject: `Verify your account on Podz Network`,
		html: `
      <div>
        <p>Please follow  to confirm your email.</p>
      </div>
	<div>
		<p>Hello, ${req.user.name}</p>
		<p>Welcome to Podz Network! We are excited to have you on board and to provide you with access to our wide range of podcasts and services.</p> 
		<p>In order to complete your registration and activate your account, we need you to verify your email address by clicking on <a href="${process.env.NEXT_PUBLIC_WEB_URI}/verify-email/${token._id}">this link.</a></p> 
		<p>Once you have verified your email, you will be able to access your account, create and manage your profile, and access our content.</p> 
		<p>If you did not sign up for an account on Podz Network or if you have any questions or concerns, please do not hesitate to contact us.</p> 
		<p>Best regards,</p>
		<p>Podz Network Team</p>
		<p>P.S. Please note that this link will expire in 24 hours, after that you will need to request a new password reset link.</p>
	</div>
      `
	})

	res.status(204).end()
})

export default router.handler(ncRouteHandlerOpts)
