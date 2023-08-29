import SignUpCompletion from "@/components/authentication/SignUpCompletion"
import Head from "next/head"

const SignupPage = ({ userId, valid, tokenId }) => {
	return (
		<>
			<Head>
				<title>Sign Up</title>
			</Head>
			<SignUpCompletion userId={userId} valid={valid} tokenId={tokenId} />
		</>
	)
}

export async function getServerSideProps(context) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_WEB_URI}/api/token/${context.query.token}`
	)
	const token = await response.json()
	return {
		props: {
			tokenId: token?._id ?? null,
			userId: token?.creatorId ?? null,
			valid: token ? true : false
		}
	}
}

export default SignupPage
