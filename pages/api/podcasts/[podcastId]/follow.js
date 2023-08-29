import {
	followPodcast,
	getFollowedPodcast,
	unfollowPodcast
} from "@/lib/api/db"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database, tokenChecker).get(async (req, res) => {
	try {
		const podcast = await getFollowedPodcast(
			req.user._id,
			req.query.podcastId
		)
		return res.json(podcast[0])
	} catch (e) {
		return res.status(500).end()
	}
})

//Put the podcast into the followed podcasts
router.use(database, tokenChecker).patch(async (req, res) => {
	try {
		if (req.query.unfollow) {
			await unfollowPodcast(req.user._id, req.query.podcastId)
			return res.status(200).end()
		}
		const updatedUser = await followPodcast(
			req.user._id,
			req.query.podcastId
		)
		return res.json(updatedUser)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
