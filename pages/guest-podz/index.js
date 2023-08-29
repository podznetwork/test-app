import { Wrapper } from "@/components/Layout"
import GuestPodcasts from "@/components/podcast/GuestPodcasts"
import { userRoles } from "@/lib/app/user"

function GuestPodcastsPage() {
	return (
		<Wrapper>
			<GuestPodcasts />
		</Wrapper>
	)
}

GuestPodcastsPage.routeProtector = [userRoles.GUEST]

export default GuestPodcastsPage
