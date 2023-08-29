import { updateUserPasswordByOldPassword } from "@/lib/api/db"
import { database, tokenChecker, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidateUser } from "@/lib/api/validation/user"
import { createRouter } from "next-connect"

const router = createRouter()
router.use(tokenChecker, database)

router.put(
	validateBody({
		type: "object",
		properties: {
			newPassword: ValidateUser.password,
			oldPassword: ValidateUser.password
		},
		required: ["newPassword", "oldPassword"],
		additionalProperties: false
	}),
	async (req, res) => {
		const { oldPassword, newPassword } = req.body

		const success = await updateUserPasswordByOldPassword(
			req.user._id,
			oldPassword,
			newPassword
		)

		if (!success) {
			res.status(401).json({
				error: {
					message: "An error occurred in changing the password."
				}
			})
			return
		}

		res.status(204).end()
	}
)

export default router.handler(ncRouteHandlerOpts)
