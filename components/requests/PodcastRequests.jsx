import { useRequest } from "@/lib/app/request"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import { useRouter } from "next/router"

function PodcastRequests() {
	const { request } = useRequest("owner")
	const router = useRouter()

	return (
		<>
			{request ? (
				<div className="flex flex-col gap-5 mt-5">
					<div className="flex gap-x-4">
						<SectionHeading
							replaceClassName="w-auto flex flex-col lg:flex-row lg:items-center gap-5"
							button={request?.status === "approved" && "Pay"}
							buttonOnClick={() =>
								router.replace("/podcast-requests/verify")
							}
						>
							My PODZ Requests
						</SectionHeading>
						{request?.status === "pending" && (
							<div className="flex items-center text-sm py-1 px-8 rounded-[19px] bg-[#AF7F68] text-white">
								Pending
							</div>
						)}
					</div>
					<Table
						className="hidden my-6 lg:block"
						headers={["name", "description", "genre"]}
						fields={["podcastName", "podcastDescription", "genre"]}
						data={[request]}
					/>
				</div>
			) : (
				<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
					You have not requested to be Podcast Owner yet. Initiate
					your request by clicking the Add your Podz button.
				</div>
			)}
		</>
	)
}

export default PodcastRequests
