import { findUserById } from "@/lib/api/db"
import { addEpisode } from "@/lib/api/db/episode"
import {
	addPodcastPage,
	getAllPodcasts,
	getPodcastByName,
	getPodcasts,
	getPodcastsByName
} from "@/lib/api/db/podcast"
import { sendMail } from "@/lib/api/mail"
import { database, tokenChecker, validateBody } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { ValidatePodcast } from "@/lib/api/validation/podcast"
import { createRouter } from "next-connect"
import { stripHtml } from "string-strip-html"

const router = createRouter()

router.use(database, tokenChecker)

router.get(async (req, res) => {
	try {
		const user = await findUserById(req.user._id)
		let podcasts
		if (user.access.includes("admin")) {
			podcasts = await getAllPodcasts()
		} else {
			podcasts = await getPodcasts(req.user._id)
		}
		return res.json(podcasts)
	} catch (e) {
		return res.status(500).end()
	}
})

router.post(
	validateBody({
		type: "object",
		properties: {
			name: ValidatePodcast.name,
			description: ValidatePodcast.description,
			logoPath: ValidatePodcast.logoPath,
			hosts: ValidatePodcast.hosts,
			genre: ValidatePodcast.genre
		},
		required: ["name", "description", "logoPath", "hosts", "genre"],
		additionalProperties: true
	}),
	async (req, res) => {
		const { name, description, logoPath, hosts, genre, episodes, rssLink } =
			req.body
		try {
			const prevPodcasts = await getPodcastsByName(name)
			let uId = name.split(" ").join("_").toLowerCase()

			if (prevPodcasts?.length > 0) {
				uId += `_${prevPodcasts.length}`
			}

			let latestEpisodeDate = new Date("01-01-1900")
			for (let i = 0; i < episodes.length; i++) {
				const pubDate = new Date(episodes[i].pubDate)
				if (pubDate > latestEpisodeDate) {
					latestEpisodeDate = pubDate
				}
			}

			const podcastId = await addPodcastPage({
				uId: uId,
				owner: req.user._id,
				name,
				description: stripHtml(description ?? "").result ?? "",
				hosts,
				logoPath,
				genre,
				rssLink,
				latestEpisodeDate
			})

			hosts.forEach(async host => {
				if (host._id.match(/^[0-9a-fA-F]{24}$/)) {
					const user = await findUserById(host._id)

					await sendMail({
						to: user.email,
						from: process.env.FROM_EMAIL,
						subject: `Invitation to host ${name} on Podz Network`,
						html: `
						<div>
						  <p>Hello</p>
							<p>${name} would like to extend an exciting invitation for you to become the host of their podcast. They have been following your work/expertise and believe that you would be the perfect fit to lead our podcast and bring valuable insights and perspectives to our audience. Please confirm your hosting at ${process.env.NEXT_PUBLIC_WEB_URI} </p> 
							<p>Please login to your account ${process.env.NEXT_PUBLIC_WEB_URI} to check more details about the opportunity and to confirm your availability. </p> 
							<p>We are looking forward to having you on board and thank you for considering their invitation. Being a host on their Podcast, you will also be exposed to our wide audience on Podz Network.</p> 
							<p>Best regards,</p>
							<p>Podz Network Team</p>
							<p>P.S. Please note that this link will expire in 24 hours, after that you will need to request a new password reset link.</p>
						</div>
						`
					})
				}
			})

			const savedEpisodes = []

			for (let i = 0; i < episodes.length; i++) {
				const newEpisode = {
					name: episodes[i].title,
					description:
						stripHtml(
							episodes[i].content ??
								episodes[i].itunes?.summary ??
								""
						).result ?? "",
					imagePath: episodes[i].itunes?.image ?? logoPath,
					podcastId,
					enclosure: episodes[i].enclosure.url,
					pubDate: episodes[i].pubDate,
					keywords: episodes[i].keywords ?? [],
					genre: genre
				}

				const episodeId = await addEpisode(newEpisode)

				newEpisode._id = episodeId
				savedEpisodes[i] = newEpisode
			}

			return res.json({ podcastId, savedEpisodes })
		} catch (e) {
			return res.status(500).end()
		}
	}
)

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "4mb"
		}
	}
}

export default router.handler(ncRouteHandlerOpts)
