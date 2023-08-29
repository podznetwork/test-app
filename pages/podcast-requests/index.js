import { Wrapper } from "@/components/Layout"
import PodcastRequests from "@/components/requests/PodcastRequests"
import { userRoles } from "@/lib/app/user"

function RequestsPage() {
	return (
		<Wrapper>
			<PodcastRequests />
		</Wrapper>
	)
}
RequestsPage.routeProtector = [userRoles.USER]

export default RequestsPage
