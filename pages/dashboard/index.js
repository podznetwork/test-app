import Dashboard from "@/components/dashboard"
import { Wrapper } from "@/components/Layout"
import { userRoles } from "@/lib/app/user"

function DashboardPage() {
	return (
		<Wrapper>
			<Dashboard />
		</Wrapper>
	)
}

DashboardPage.routeProtector = [userRoles.ADMIN]

export default DashboardPage
