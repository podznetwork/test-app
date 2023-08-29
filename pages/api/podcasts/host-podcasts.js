import {
	changePodcastHostStatus,
	declinePodcastHosting,
	getPodcastsForHost
} from "@/lib/api/db/podcast"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { findUserById, updateUserById } from "@/lib/api/db"
import { sendMail } from "@/lib/api/mail"
import { addAdminMessage } from "@/lib/api/db/conversation"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	try {
		const podcasts = await getPodcastsForHost(req.user._id)
		return res.json(podcasts)
	} catch (e) {
		return res.status(500).end()
	}
})

router.put(async (req, res) => {
	try {
		const user = await findUserById(req.user._id)

		const updatedPodcast = await changePodcastHostStatus(
			req.body.podcastId,
			req.user._id,
			req.body.status
		)

		const podcastOwner = await findUserById(updatedPodcast.owner)

		await sendMail({
			to: user.email,
			from: process.env.FROM_EMAIL,
			subject: "Podcast host request accepted",
			html: `
				<div>
				<p>Hello, ${user.name}</p>
				
				<p>You have accepted the request to become a host for the podcast ${updatedPodcast.name} at Podz Network. You have been officially listed as a host of this podcast now.</p>
				
				<p>If you have any questions or concerns, please do not hesitate to contact us.</p>
				
				<p>Best regards,</p>
				
				<p>Podz Network Team</p>
			  </div>
				`
		})

		await addAdminMessage(
			user._id,
			`You have accepted the request to become a host for the podcast ${updatedPodcast.name} at Podz Network. You have been officially listed as a host of this podcast now.`
		)

		await sendMail({
			to: podcastOwner.email,
			from: process.env.FROM_EMAIL,
			subject: `Host request for Podcast ${updatedPodcast.name} has been accepted.`,
			html: `
				<div>
				<p>Hello, ${podcastOwner.name}</p>
				
				<p>The user ${user.name} has accepted your request to host the podcast ${updatedPodcast.name}. They have been officially listed as a host of the podcast.</p>
				
				<p>If you have any questions or concerns, please do not hesitate to contact us.</p>
				
				<p>Best regards,</p>
				
				<p>Podz Network Team</p>
			  </div>
				`
		})

		await addAdminMessage(
			podcastOwner._id,
			`The user ${user.name} has accepted your request to host the podcast ${updatedPodcast.name}. They have been officially listed as a host of the podcast.`
		)

		if (!user.access.includes("host")) {
			await updateUserById(req.user._id, {
				access: [...user.access, "host"]
			})
		}

		return res.json(updatedPodcast)
	} catch (e) {
		return res.status(500).end()
	}
})

router.patch(async (req, res) => {
	try {
		const updatedPodcast = await declinePodcastHosting(
			req.body.podcastId,
			req.user._id
		)
		const owner = await findUserById(updatedPodcast.owner)

		await sendMail({
			to: owner.email,
			from: process.env.FROM_EMAIL,
			subject: `Host request for Podcast ${updatedPodcast.name} has been rejected.`,
			html: `
				<div>
				<p>Hello, ${owner.name}</p>
				
				<p>Unfortunately, the host request for the podcast ${updatedPodcast.name} has been rejected.</p>
				
				<p>If you have any questions or concerns, please do not hesitate to contact us.</p>
				
				<p>Best regards,</p>
				
				<p>Podz Network Team</p>
			  </div>
				`
		})

		await addAdminMessage(
			owner._id,
			`Unfortunately, the host request for the podcast ${updatedPodcast.name} has been rejected.`
		)

		return res.json(updatedPodcast)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
