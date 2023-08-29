import { Wrapper } from "@/components/Layout"
// import {userTable} from "@/components/users/table"
// import UserTable from "@/components/users/table"
import Users from "@/components/users/Users"
import { userRoles } from "@/lib/app/user"

function UsersPage() {
	return (
		<Wrapper>
			<Users />
		</Wrapper>
	)
}

UsersPage.routeProtector = [userRoles.ADMIN]
export default UsersPage
