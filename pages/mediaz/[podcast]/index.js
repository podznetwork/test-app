import { Wrapper } from "@/components/Layout"
import Media from "@/components/content/mediaZ/Media"
import { userRoles } from "@/lib/app/user"

function MediaZPage() {
	return (
		<Wrapper>
			<Media />
		</Wrapper>
	)
}

MediaZPage.routeProtector = [userRoles.OWNER, userRoles.ADMIN]

export default MediaZPage
