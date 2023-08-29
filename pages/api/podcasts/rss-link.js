import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import Parser from "rss-parser"

const router = createRouter()
const parser = new Parser()

router.use(database, tokenChecker)

router.post(async (req, res) => {
	try {
		let feed = await parser.parseURL(req.body.url)
		const rssResponse = {
			title: feed.title,
			description: feed.description,
			itunes: {
				categories: feed.itunes?.categories
			},
			image: {
				url: feed.image?.url
			},
			items: []
		}

		for (let i = 0; i < feed.items.length; i++) {
			const episode = {
				title: feed.items[i].title ?? null,
				content: feed.items[i].content ?? null,
				itunes: {
					summary: feed.items[i].itunes?.summary ?? null,
					image: feed.items[i].itunes?.image ?? null
				},
				enclosure: {
					url: feed.items[i].enclosure?.url ?? null
				},
				pubDate: feed.items[i].pubDate ?? null,
				keywords: feed.items[i].keywords ?? null
			}
			rssResponse.items[i] = episode
		}

		return res.json(rssResponse)
	} catch (e) {
		return res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
