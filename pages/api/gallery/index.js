import { addGalleryImage, getImages } from "@/lib/api/db/gallery"
import { database, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidateImage } from "@/lib/api/validation/gallery"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	try {
		const images = await getImages()
		return res.json(images)
	} catch (e) {
		return res.status(500).end()
	}
})

router.post(
	validateBody({
		type: "object",
		properties: {
			name: ValidateImage.name,
			description: ValidateImage.description,
			sponsored: ValidateImage.sponsored,
			path: ValidateImage.path,
			url: ValidateImage.url
		},
		required: ["name", "description", "sponsored", "path", "url"],
		additionalProperties: false
	}),
	async (req, res) => {
		const { name, description, url, sponsored, path } = req.body

		try {
			const imageId = await addGalleryImage({
				// creatorId: req.user._id,
				url,
				name,
				description,
				sponsored,
				path
			})

			return res.json(imageId)
		} catch (e) {
			return res.status(500).end()
		}
	}
)

export default router.handler(ncRouteHandlerOpts)
