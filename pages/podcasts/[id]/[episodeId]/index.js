import { Wrapper } from "@/components/Layout"
import { userRoles } from "@/lib/app/user"
import EpisodeDetails from "@/components/podcast/EpisodeDetails"

function PodcastEpisodePage() {
	return (
		<Wrapper>
			<EpisodeDetails />
		</Wrapper>
	)
}

PodcastEpisodePage.routeProtector = [userRoles.OWNER]
export default PodcastEpisodePage
