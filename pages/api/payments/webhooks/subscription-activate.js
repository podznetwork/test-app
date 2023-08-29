import { database } from "@/lib/api/middlewares"
import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { createRouter } from "next-connect"
import { getUserBySubscriptionId } from "@/lib/api/db/payment"

const router = createRouter()

router.use(database)

//Receive subscription activation update
router.post(async (req, res) => {
	try {
		const subscriptionId = req.body.resource.id
		const user = await getUserBySubscriptionId(subscriptionId)
		fetch(`${process.env.NEXT_PUBLIC_WEB_URI}/api/podcasts/refetch`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				_id: user._id
			})
		})

		return res.status(200).end()
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
