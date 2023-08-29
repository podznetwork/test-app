import { VerifyEmail } from "@/components/authentication"
import { findAndDeleteTokenByIdAndType, updateUserById } from "@/lib/api/db"
import { database } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import Head from "next/head"

export default function EmailVerifyPage({ valid }) {
	return (
		<>
			<Head>
				<title>Email verification</title>
			</Head>
			<VerifyEmail valid={valid} />
		</>
	)
}

export async function getServerSideProps(context) {
	const router = createRouter()
	router.use(database).use(() => null)
	await router.run(context.req, context.res)

	const { token } = context.params

	const deletedToken = await findAndDeleteTokenByIdAndType(
		token,
		"emailVerify"
	)

	if (!deletedToken) return { props: { valid: false } }

	await updateUserById(deletedToken.creatorId, {
		emailVerified: true
	})

	return { props: { valid: true } }
}
