import { Login } from "@/components/authentication"
import Head from "next/head"

const LoginPage = () => {
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<Login />
		</>
	)
}

LoginPage.routeProtector = "GUEST"

export default LoginPage
