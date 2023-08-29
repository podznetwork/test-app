import {
	completeSignUp,
	deleteUser,
	findAndDeleteTokenByIdAndType,
	findUserById,
	updateUserById
} from "@/lib/api/db"
import { database, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidateUser } from "@/lib/api/validation/user"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	const user = await findUserById(req.query.userId)
	res.json(user)
})

router.put(
	validateBody({
		type: "object",
		properties: {
			username: ValidateUser.username,
			name: ValidateUser.name,
			password: ValidateUser.password
		},
		required: ["username", "name", "password"],
		additionalProperties: true
	}),
	async (req, res) => {
		let { password, token, name, username } = req.body
		try {
			const matchedCount = await completeSignUp(req.query.userId, {
				name,
				username,
				originalPassword: password
			})
			await findAndDeleteTokenByIdAndType(token, "userSignup")
			if (!matchedCount) return res.status(500).end()
			else return res.status(200).end()
		} catch (e) {
			return res.status(500).end()
		}
	}
)

router.patch(async (req, res) => {
	try {
		const updatedUser = await updateUserById(req.query.userId, req.body)
		return res.json(updatedUser)
	} catch (e) {
		return res.status(500).end()
	}
})

router.delete(async (req, res) => {
	const userId = req.query.userId
	try {
		await deleteUser(userId)
		return res.status(200).end()
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
