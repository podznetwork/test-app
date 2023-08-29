import { Wrapper } from "@/components/Layout"
import VerifyRequest from "@/components/requests/Verify"
import { userRoles } from "@/lib/app/user"

function RequestsPage() {
	return (
		<Wrapper>
			<VerifyRequest />
		</Wrapper>
	)
}
RequestsPage.routeProtector = [userRoles.USER]

export default RequestsPage
