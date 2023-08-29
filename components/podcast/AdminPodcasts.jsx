import React from "react"
import { SectionHeading } from "../common/Typography"
import { useRouter } from "next/router"

function AdminPodcasts() {
	const router = useRouter()
	return (
		<div className="flex flex-col gap-y-5">
			<SectionHeading
				button="Add new podcast"
				buttonOnClick={() => router.push("/podz-management/add")}
			>
				Podcasts
			</SectionHeading>
		</div>
	)
}

export default AdminPodcasts
