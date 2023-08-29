import Image from "next/image"
import { useRouter } from "next/router"
import { SectionHeading } from "../common/Typography"
import { useRequest } from "@/lib/app/request"
import { AddPodcastView } from "pages/requests/access"

function VerifyRequest() {
	const router = useRouter()
	const { request } = useRequest("owner")

	if (request) {
		const allHosts = [...request.hostUsers]
		for (let i = 0; i < request.hosts.length; i++) {
			if (!request.hosts[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
				allHosts.push(request.hosts[i])
			}
		}
		request.allHosts = allHosts
	}

	return (
		<div className="flex flex-col gap-5 mt-5">
			<div className="flex flex-row gap-x-2">
				<button
					onClick={() => router.back()}
					className="flex items-center"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading
					button="Skip to Payment"
					buttonOnClick={() => router.replace("/pricing-plans")}
				>
					Please verify your information before payment
				</SectionHeading>
			</div>
			<AddPodcastView ownerRequest={request} />
		</div>
	)
}

export default VerifyRequest
