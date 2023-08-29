import Landing from "@/components/landing"
import { Wrapper } from "@/components/Layout"
import { userRoles } from "@/lib/app/user"

function LandingPage() {
	return (
		<Wrapper>
			<Landing />
		</Wrapper>
	)
}

LandingPage.routeProtector = [userRoles.ADMIN, userRoles.EDITOR]
export default LandingPage
