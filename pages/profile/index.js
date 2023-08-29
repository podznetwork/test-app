import { Wrapper } from "@/components/Layout"
import HostProfile from "@/components/profile/host"
import { usePublicGuestEpisodes } from "@/lib/app/episode"
import {
	useFollowedPodcasts,
	useHostPodcasts,
	usePodcasts
} from "@/lib/app/podcast"
import { useCurrentUser, userRoles, useUserMutator } from "@/lib/app/user"

function ProfilePage() {
	const { user, loading: userLoading } = useCurrentUser()
	const userMutator = useUserMutator()
	const { podcasts } = useHostPodcasts()
	const { podcasts: ownerPodcasts } = usePodcasts()
	const { episodes } = usePublicGuestEpisodes(user?._id)
	const { podcasts: favoritePodcasts } = useFollowedPodcasts()

	return (
		<Wrapper>
			<HostProfile
				favoritePodcasts={favoritePodcasts}
				podcasts={podcasts}
				ownerPodcasts={ownerPodcasts}
				userLoading={userLoading}
				editable={true}
				user={user}
				userMutator={userMutator}
				episodes={episodes}
			/>
		</Wrapper>
	)
}

ProfilePage.routeProtector = [
	userRoles.USER,
	userRoles.HOST,
	userRoles.GUEST,
	userRoles.OWNER
]

export default ProfilePage
