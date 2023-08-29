import { addGoogleUser, findUserByEmail } from "@/lib/api/db"
import { database, db } from "@/lib/api/middlewares"
import { verifyPassword } from "@/lib/app/user"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { createRouter } from "next-connect"

export default async function auth(req, res) {
	const router = createRouter()
	if (
		req.query.nextauth.includes("credentials") ||
		req.query.nextauth.includes("signin")
	) {
		router.use(database).use(() => null)
		await router.run(req, res)
	}
	return await NextAuth(req, res, {
		providers: [
			CredentialsProvider({
				async authorize(credentials) {
					const { email, password } = credentials

					const user = await db.collection("users").findOne({
						email
					})
					if (!user)
						throw new Error(
							"Account not found. Please create an account."
						)
					if (!user.emailVerified) {
						throw new Error(
							"Email not verified. Please verify your email."
						)
					}

					const isPasswordValid = await verifyPassword(
						password,
						user.password
					)

					if (!isPasswordValid) throw new Error("Incorrect Password")

					return {
						id: user._id.toString(),
						email: user.email,
						username: user.username,
						name: user.name,
						role: user.role,
						access: user.access
					}
				}
			}),
			GoogleProvider({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				async profile(profile, tokens) {
					let foundUser = await findUserByEmail(profile.email)
					let userId
					if (!foundUser) {
						// TODO: Add role and access array when signed up with Google
						userId = await addGoogleUser({
							email: profile.email,
							name: profile.name,
							profilePicture: profile.picture,
							accessToken: tokens.access_token,
							tokenExpiry: tokens.expires_at
						})
					}

					return {
						id: foundUser
							? foundUser._id.toString()
							: userId.toString(),
						name: foundUser ? foundUser.name : profile.name,
						email: foundUser ? foundUser.email : profile.email,
						profilePicture: foundUser
							? foundUser.profilePicture
							: profile.picture,
						role: foundUser ? foundUser.role : "user",
						access: foundUser ? foundUser.access : ["user"]
					}
				}
			})
		],

		pages: {
			error: "/login"
		},

		session: {
			strategy: "jwt"
		},

		callbacks: {
			async jwt({ token, user, trigger, session }) {
				if (user) {
					token.username = user.username
					token.name = user.name
					token.role = user.role
					token.access = user.access
					token.emailVerified = user.emailVerified
				}

				if (trigger === "update") {
					token.access = session.access
				}

				return token
			},

			async session({ session, token }) {
				session.user.id = token.sub
				session.user.username = token.username
				session.user.name = token.name
				session.user.role = token.role
				session.user.emailVerified = token.role
				session.user.access = token.access

				return session
			}
		},

		debug: true,
		secret: process.env.SECRET
	})
}
