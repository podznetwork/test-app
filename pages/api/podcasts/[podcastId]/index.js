import { findUserById } from "@/lib/api/db"
import {
	deletePodcast,
	editPodcast,
	editPodcastByAdmin,
	getPodcast
} from "@/lib/api/db/podcast"
import { database, tokenChecker, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidatePodcast } from "@/lib/api/validation/podcast"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database).get(async (req, res) => {
	try {
		const podcasts = await getPodcast(req.query.podcastId)
		return res.json(podcasts)
	} catch (e) {
		return res.status(500).end()
	}
})

router.use(database, tokenChecker).put(
	validateBody({
		type: "object",
		properties: {
			name: ValidatePodcast.name,
			description: ValidatePodcast.description,
			logoPath: ValidatePodcast.logoPath,
			hosts: ValidatePodcast.hosts,
			genre: ValidatePodcast.genre
		},
		additionalProperties: true
	}),
	async (req, res) => {
		try {
			const user = await findUserById(req.user._id)
			let updatedPodcast
			if (user.access.includes("admin")) {
				updatedPodcast = await editPodcastByAdmin(req.query.podcastId, {
					...req.body
				})
			} else {
				updatedPodcast = await editPodcast(req.query.podcastId, {
					...req.body
				})
			}
			return res.json(updatedPodcast)
		} catch (e) {
			console.log(e)
			return res.status(500).end()
		}
	}
)

router.use(database, tokenChecker).delete(async (req, res) => {
	try {
		await deletePodcast(req.query.podcastId)
		return res.status(200).end()
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
