import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { sendMail } from "@/lib/api/mail"

const router = createRouter()

router.use(database)

router.post(async (req, res) => {
	try {
		if (req.query.type === "advertise") {
			await sendMail({
				to: process.env.SEED_ADMIN_EMAIL,
				from: process.env.FROM_EMAIL,
				subject: `Advertisement Message from ${req.body.name} at Podznetwork.com`,
				html: `
                <div>
                    <p>
                        <b>Name:</b> ${req.body.name} <br />
                        <b>Email:</b> ${req.body.email} <br />
                        <b>Podcast:</b> ${req.body.podcast} <br />
                        <b>Phone:</b> ${req.body.phone} <br />
                        <b>Message:</b> ${req.body.message}
                    </p> 
                </div>
                `
			})
		} else {
			await sendMail({
				to: process.env.SEED_ADMIN_EMAIL,
				from: process.env.FROM_EMAIL,
				subject: `Message from ${req.body.email} at Podznetwork.com`,
				html: `
                <div>
                    <p>
                        <b>${req.body.subject}</b><br />
                        <b>Email:</b> ${req.body.email} <br />
                        <b>Message:</b> ${req.body.message}
                    </p> 
                </div>
                `
			})
		}

		return res.status(200).end()
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
