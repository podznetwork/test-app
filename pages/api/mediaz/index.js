import { database, db, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { checkIfBucketExists, putObjectsS3 } from "@/lib/api/s3/utils"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import { createRouter } from "next-connect"
import { ObjectId } from "mongodb"
import { getMediaZ } from "@/lib/api/db/mediaz"
const router = createRouter()

router.use(tokenChecker, database)

const upload = multer().any()

router.get(async (req, res) => {
	try {
		const { podcast } = req.query
		const mediaZ = await getMediaZ(podcast)
		res.status(200).json(mediaZ)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			error: { message: "Internal server error." }
		})
	}
})

router.post(
	async (req, res, next) => {
		try {
			await new Promise((resolve, reject) => {
				upload(req, res, err => {
					if (err) reject(err)
					resolve()
				})
			})
			return await next()
		} catch (e) {
			return res.status(500).end()
		}
	},
	async (req, res) => {
		try {
			const { podcast } = req.query
			// await createS3Bucket()
			if (await checkIfBucketExists()) {
				req.files.forEach(async file => {
					const fileId = uuidv4()
					await putObjectsS3([
						{
							Key: `${
								file.mimetype.split("/")[0]
							}/${fileId}.${file.originalname.split(".").pop()}`,
							Body: file.buffer
						}
					])

					await db.collection("mediaz").insertOne({
						s3path: `${
							file.mimetype.split("/")[0]
						}/${fileId}.${file.originalname.split(".").pop()}`,
						type: file.mimetype.split("/")[0],
						originalName: file.originalname,
						createdAt: new Date(),
						modifiedAt: new Date(),
						podcast: new ObjectId(podcast)
					})

					await db.collection("podcasts").updateOne(
						{
							_id: new ObjectId(podcast)
						},
						{
							$set: {
								mediaZUpdatedAt: new Date(),
								newMedia: true
							}
						}
					)
					return res.json({
						message: "File uploaded successfully."
					})
				})
			} else {
				throw new Error("Bucket does not exist.")
			}
		} catch (e) {
			console.log(e)
			res.status(500).json({
				error: e.message
			})
		}
	}
)

export const config = {
	api: {
		bodyParser: false
	}
}

export default router.handler(ncRouteHandlerOpts)
