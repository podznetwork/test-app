import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

function Authentication({
	children,
	waitContent = null,
	redirectUrl = "/login"
}) {
	const { data: session, status } = useSession()
	const loading = status === "loading"
	const router = useRouter()

	if (!loading && !session) router.push(redirectUrl)
	if (!loading && session) return children
	return waitContent
}

export default Authentication
