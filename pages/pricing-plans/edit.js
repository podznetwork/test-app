import { Wrapper } from "@/components/Layout"
import EditComponent from "@/components/pricing/edit"
import { userRoles } from "@/lib/app/user"
function EditPricingPage() {
	return (
		<Wrapper>
			<EditComponent />
		</Wrapper>
	)
}

EditPricingPage.routeProtector = [userRoles.ADMIN, userRoles.EDITOR]

export default EditPricingPage
