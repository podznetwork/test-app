import { deleteImage, editGalleryImage } from "@/lib/api/db/gallery"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker)

router.put(async (req, res) => {
	try {
		const { imageId } = req.query
		const { name, description, sponsored, path, url } = req.body
		const updatedImage = {
			name,
			description,
			sponsored,
			path,
			url,
			updatedAt: new Date()
		}
		const image = await editGalleryImage(imageId, updatedImage)
		return res.status(200).json(image)
	} catch (e) {
		console.log(e)
		return res.status(500).end()
	}
})

router.delete(async (req, res) => {
	try {
		await deleteImage(req.query.imageId)
		return res.status(200).end()
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
