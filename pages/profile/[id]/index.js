import { Wrapper } from "@/components/Layout"
import HostProfile from "@/components/profile/host"
import { usePublicGuestEpisodes } from "@/lib/app/episode"
import {
	useFollowedPodcasts,
	usePublicHostPodcasts,
	usePublicPodcasts
} from "@/lib/app/podcast"
import { useCurrentUser, useUser } from "@/lib/app/user"
import { useRouter } from "next/router"
function ProfilePage() {
	const router = useRouter()
	const { podcasts } = usePublicHostPodcasts(router.query.id)
	const { episodes } = usePublicGuestEpisodes(router.query.id)
	const { podcasts: ownerPodcasts } = usePublicPodcasts(router.query.id)
	const { user, loading: userLoading } = useUser(router.query.id)
	const { user: currentUser } = useCurrentUser()
	const { podcasts: favoritePodcasts } = useFollowedPodcasts(router.query.id)

	return (
		<Wrapper>
			<HostProfile
				favoritePodcasts={favoritePodcasts}
				userLoading={userLoading}
				editable={currentUser?.access.includes("admin") ? true : false}
				user={user}
				podcasts={podcasts}
				ownerPodcasts={ownerPodcasts}
				episodes={episodes}
			/>
		</Wrapper>
	)
}

export default ProfilePage
