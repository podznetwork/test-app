import { ForgetPasswordToken } from "@/components/authentication"
import { findTokenByIdAndType } from "@/lib/api/db"
import { database } from "@/lib/api/middlewares"
import { createRouter } from "next-connect"
import Head from "next/head"

const ResetPasswordTokenPage = ({ valid, token }) => {
	return (
		<>
			<Head>
				<title>Forgot password?</title>
			</Head>
			<ForgetPasswordToken valid={valid} token={token} />
		</>
	)
}

export async function getServerSideProps(context) {
	const router = createRouter()
	router.use(database).use(() => null)
	await router.run(context.req, context.res)
	const tokenDoc = await findTokenByIdAndType(
		context.params.token,
		"passwordReset"
	)

	return { props: { token: context.params.token, valid: !!tokenDoc } }
}

export default ResetPasswordTokenPage
