import { Wrapper } from "@/components/Layout"
import PodcastTables from "@/components/podcast/PodcastTables"
import { userRoles } from "@/lib/app/user"

function OwnerPodcastPage() {
	return (
		<Wrapper>
			<PodcastTables />
		</Wrapper>
	)
}
OwnerPodcastPage.routeProtector = [userRoles.OWNER]

export default OwnerPodcastPage
