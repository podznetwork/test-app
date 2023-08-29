import { Wrapper } from "@/components/Layout"
import GuestRequest from "@/components/requests/GuestRequest"
import { userRoles } from "@/lib/app/user"
import React from "react"

function GuestRequestPage() {
	return (
		<Wrapper>
			<GuestRequest />
		</Wrapper>
	)
}

GuestRequestPage.routeProtector = [userRoles.USER]

export default GuestRequestPage
