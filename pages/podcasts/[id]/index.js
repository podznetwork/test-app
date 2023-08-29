import Podcast from "@/components/podcast/Podcast"
import { Wrapper } from "@/components/Layout"
import { userRoles } from "@/lib/app/user"

function PodcastPage() {
	return (
		<Wrapper>
			<Podcast />
		</Wrapper>
	)
}

PodcastPage.routeProtector = [userRoles.OWNER]
export default PodcastPage
