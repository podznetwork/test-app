import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

function Access({ children, waitContent = null, access }) {
	const { data: session, status } = useSession()
	const loading = status === "loading"
	const router = useRouter()
	const user = session?.user

	//If there are no access defined for the page, allow the page to be rendered
	if (access == undefined) {
		return children
	}
	if (!loading && !user) router.push("/login")
	else if (!loading && user && !access.some(r => user.access.includes(r))) {
		if (
			user.access.includes("admin") &&
			router.pathname === "/mypodcasts"
		) {
			router.push("/dashboard")
		} else {
			router.push("/401")
		}
	} else if (!loading && user && access.some(r => user.access.includes(r)))
		return children

	return waitContent
}

export default Access
