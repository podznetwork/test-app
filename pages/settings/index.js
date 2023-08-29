import { Wrapper } from "@/components/Layout"
import { Settings } from "@/components/settings"
import { userRoles } from "@/lib/app/user"
import Head from "next/head"

const SettingsPage = () => {
	return (
		<>
			<Head>
				<title>Settings</title>
			</Head>
			<Wrapper>
				<Settings />
			</Wrapper>
		</>
	)
}

SettingsPage.routeProtector = [
	userRoles.USER,
	userRoles.HOST,
	userRoles.OWNER,
	userRoles.GUEST
]

export default SettingsPage
