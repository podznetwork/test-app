import { Wrapper } from "@/components/Layout"
import MediaZ from "@/components/content/mediaZ"
import { userRoles } from "@/lib/app/user"

function MediaZPage() {
	return (
		<Wrapper>
			<MediaZ />
		</Wrapper>
	)
}

MediaZPage.routeProtector = [userRoles.OWNER, userRoles.ADMIN]

export default MediaZPage
