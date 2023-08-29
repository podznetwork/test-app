import { ncRouteHandlerOpts } from "@/lib/api/nc"
import { database, tokenChecker } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import { updateUserById } from "@/lib/api/db"

const router = createRouter()

router.use(database, tokenChecker)

const TWITTER_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID
const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_SECRET_KEY

const TWITTER_OAUTH_TOKEN_URL = "https://api.twitter.com/2/oauth2/token"

// we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
const BasicAuthToken = Buffer.from(
	`${TWITTER_OAUTH_CLIENT_ID}:${TWITTER_OAUTH_CLIENT_SECRET}`
).toString("base64")

export const twitterOauthTokenParams = {
	client_id: TWITTER_OAUTH_CLIENT_ID,
	code_verifier: "challenge",
	redirect_uri: `http://localhost:3000/api/auth/twitter`,
	grant_type: "authorization_code"
}

export async function getTwitterUser(accessToken) {
	try {
		const response = await fetch("https://api.twitter.com/2/users/me", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${accessToken}`
			}
		})

		const data = await response.json()

		return data.data ?? null
	} catch (err) {
		return null
	}
}

router.get(async (req, res) => {
	try {
		const code = req.query.code
		twitterOauthTokenParams.code = code
		const searchParams = new URLSearchParams(
			twitterOauthTokenParams
		).toString()

		// 1. get the access token with the code
		const response = await fetch(
			`${TWITTER_OAUTH_TOKEN_URL}?${searchParams}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${BasicAuthToken}`
				}
			}
		)
		const data = await response.json()

		// 2. get the twitter user using the access token
		const twitterUser = await getTwitterUser(data.access_token)

		// 3. save the twitter user in the database
		await updateUserById(req.user._id, {
			twitterProfile: `https://twitter.com/${twitterUser.username}`
		})

		res.status(200).send("Twitter account linked successfully.")
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
})

export default router.handler(ncRouteHandlerOpts)
