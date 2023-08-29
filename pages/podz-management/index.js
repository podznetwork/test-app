import { Wrapper } from "@/components/Layout"
import AdminPodcasts from "@/components/podcast/AdminPodcasts"
import PodcastTables from "@/components/podcast/PodcastTables"
import { userRoles } from "@/lib/app/user"

function PodzManagementPage() {
	return (
		<Wrapper>
			<PodcastTables />
		</Wrapper>
	)
}

PodzManagementPage.routeProtector = [userRoles.ADMIN]

export default PodzManagementPage
