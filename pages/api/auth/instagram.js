import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { updateUserById } from "@/lib/api/db"

const router = createRouter()

router.use(database, tokenChecker)

const INSTAGRAM_OAUTH_TOKEN_URL = "https://api.instagram.com/oauth/access_token"

export const instagramOauthTokenParams = {
	client_id: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
	client_secret: process.env.INSTAGRAM_SECRET_KEY,
	grant_type: "authorization_code",
	redirect_uri: `${process.env.NEXT_PUBLIC_WEB_URI}/api/auth/instagram`
}

export async function getInstagramUser(accessToken) {
	try {
		const response = await fetch(
			`https://graph.instagram.com/v17.0/me?fields=username&access_token=${accessToken}`
		)

		const data = await response.json()
		return data ?? null
	} catch (err) {
		return null
	}
}

router.get(async (req, res) => {
	try {
		const code = req.query.code
		instagramOauthTokenParams.code = code
		var formBody = []
		for (var property in instagramOauthTokenParams) {
			var encodedKey = encodeURIComponent(property)
			var encodedValue = encodeURIComponent(
				instagramOauthTokenParams[property]
			)
			formBody.push(encodedKey + "=" + encodedValue)
		}
		formBody = formBody.join("&")
		// 1. get the access token with the code
		const response = await fetch(INSTAGRAM_OAUTH_TOKEN_URL, {
			method: "POST",
			body: formBody,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		})
		const data = await response.json()
		// 2. get the instagram user using the access token
		const instagramUser = await getInstagramUser(data.access_token)
		// 3. save the instagram user in the database
		await updateUserById(req.user._id, {
			instagramProfile: `https://instagram.com/${instagramUser.username}`
		})

		res.status(200).send("Instagram account linked successfully.")
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
