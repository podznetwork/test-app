import { Wrapper } from "@/components/Layout"
import MyPodcasts from "@/components/podcast/MyPodcasts"
import { userRoles } from "@/lib/app/user"

function MyPodcastsPage() {
	return (
		<Wrapper>
			<MyPodcasts />
		</Wrapper>
	)
}
MyPodcastsPage.routeProtector = [
	userRoles.USER,
	userRoles.GUEST,
	userRoles.OWNER,
	userRoles.HOST
]
export default MyPodcastsPage
