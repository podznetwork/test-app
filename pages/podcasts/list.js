import { Wrapper } from "@/components/Layout"
import Confirmed from "@/components/podcast/Confirmed"
import { userRoles } from "@/lib/app/user"

function PodcastRequestsPage() {
	return (
		<Wrapper>
			<Confirmed />
		</Wrapper>
	)
}
PodcastRequestsPage.routeProtector = [userRoles.HOST]

export default PodcastRequestsPage
