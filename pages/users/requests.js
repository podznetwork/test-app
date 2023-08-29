import { Wrapper } from "@/components/Layout"
import Requests from "@/components/users/Requests"
import { userRoles } from "@/lib/app/user"

function RequestsPage() {
	return (
		<Wrapper>
			<Requests />
		</Wrapper>
	)
}

RequestsPage.routeProtector = [userRoles.ADMIN]
export default RequestsPage
