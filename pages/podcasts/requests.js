import { Wrapper } from "@/components/Layout"
import Requests from "@/components/podcast/Requests"
import { userRoles } from "@/lib/app/user"

function PodcastRequestsPage() {
	return (
		<Wrapper>
			<Requests />
		</Wrapper>
	)
}
PodcastRequestsPage.routeProtector = [userRoles.HOST, userRoles.USER]

export default PodcastRequestsPage
