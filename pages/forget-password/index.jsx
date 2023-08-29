import { ForgetPasswordIndex } from "@/components/authentication"
import Head from "next/head"

const ForgetPasswordPage = () => {
	return (
		<>
			<Head>
				<title>Forgot password?</title>
			</Head>
			<ForgetPasswordIndex />
		</>
	)
}

ForgetPasswordPage.routeProtector = "GUEST"

export default ForgetPasswordPage
