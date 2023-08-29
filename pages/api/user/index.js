import { findUserById, findUserByUsername, updateUserById } from "@/lib/api/db"
import { database, tokenChecker, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidateUser } from "@/lib/api/validation/user"
import { createRouter } from "next-connect"

import { slugUsername } from "@/lib/app/user"
import { v2 as cloudinary } from "cloudinary"

const router = createRouter()

router.use(tokenChecker, database)

router.get(async (req, res) => {
	const user = await findUserById(req.user._id)
	res.json(user)
})

router.patch(
	validateBody({
		type: "object",
		properties: {
			username: ValidateUser.username,
			name: ValidateUser.name,
			bio: ValidateUser.bio
		},
		additionalProperties: true
	}),
	async (req, res) => {
		let profilePicture
		if (req.file) {
			const image = await cloudinary.uploader.upload(req.file.path, {
				width: 512,
				height: 512,
				crop: "fill"
			})
			profilePicture = image.secure_url
		}
		const { name, bio } = req.body

		let username

		if (req.body.username) {
			username = slugUsername(req.body.username)
			if (
				username !== req.user.username &&
				(await findUserByUsername(username))
			) {
				res.status(403).json({
					error: { message: "The username has already been taken." }
				})
				return
			}
		}

		const user = await updateUserById(req.user._id, {
			...(username && { username }),
			...(name && { name }),
			...(typeof bio === "string" && { bio }),
			...(profilePicture && { profilePicture })
		})

		res.json({ user })
	}
)

export const config = {
	api: {
		bodyParser: false
	}
}

export default router.handler(ncRouteHandlerOpts)
