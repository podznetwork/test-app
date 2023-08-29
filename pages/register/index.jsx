import { Register } from "@/components/authentication"
import Head from "next/head"

const RegisterPage = () => {
	return (
		<>
			<Head>
				<title>Sign up</title>
			</Head>
			<Register />
		</>
	)
}

RegisterPage.routeProtector = "GUEST"

export default RegisterPage
