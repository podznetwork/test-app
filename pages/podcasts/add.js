import { Wrapper } from "@/components/Layout"
import AddPodcast from "@/components/podcast/AddPodcast"
import { userRoles } from "@/lib/app/user"

function OwnerPodcastPage() {
	return (
		<Wrapper>
			<AddPodcast />
		</Wrapper>
	)
}
OwnerPodcastPage.routeProtector = [userRoles.OWNER]

export default OwnerPodcastPage
