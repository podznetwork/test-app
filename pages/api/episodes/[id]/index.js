import { findUserById } from "@/lib/api/db"
import { deleteEpisode, editEpisode, getEpisode } from "@/lib/api/db/episode"
import { sendMail } from "@/lib/api/mail"
import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"

const router = createRouter()

router.use(database)

router.get(async (req, res) => {
	try {
		const episode = await getEpisode(req.query.id)
		return res.json(episode)
	} catch (e) {
		return res.status(500).end()
	}
})

router.put(async (req, res) => {
	try {
		const { name, description, guests, enclosure } = req.body

		const updatedEpisode = await editEpisode(req.query.id, {
			name,
			description,
			guests,
			enclosure
		})

		guests.forEach(async guest => {
			if (guest._id.match(/^[0-9a-fA-F]{24}$/)) {
				const user = await findUserById(guest._id)

				await sendMail({
					to: user.email,
					from: process.env.FROM_EMAIL,
					subject: `Invitation to attend Podcast as a guest`,
					html: `
					<div>
					  <p>Hello</p>
						<p>You have been invited to attend a podcast ${name}. Please confirm your attendance at ${process.env.NEXT_PUBLIC_WEB_URI} </p> 
					</div>
					`
				})
			}
		})

		return res.json(updatedEpisode)
	} catch (e) {
		return res.status(500).end()
	}
})

router.delete(async (req, res) => {
	try {
		await deleteEpisode(req.query.id)
		return res.status(200).end()
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
