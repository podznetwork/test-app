import { getToken } from "next-auth/jwt"

export default async function tokenChecker(req, res, next) {
	const token = await getToken({
		req,
		secret: process.env.SECRET
	})
	if (!token) return res.status(401).end()
	const { email, username, sub: _id, name } = token
	req.user = {
		_id,
		email,
		username,
		name
	}
	return next()
}
