import {
	changePodcastHostStatus,
	declinePodcastHosting,
	useHostPodcasts,
	useHostPodcastsMutator
} from "@/lib/app/podcast"
import { useSession } from "next-auth/react"
import { useState } from "react"
import toast from "react-hot-toast"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { DeleteConfirmationModal } from "../common/Modal"
import { useSWRConfig } from "swr"

function RequestCard({
	request,
	onConfirm,
	onDecline,
	onDiscontinue,
	approved
}) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<h3 className="font-semibold text-primary">{request.name}</h3>
			<p>{request.description}</p>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Genres</h4>
				<p>
					{request.genre.map((gen, index) => (
						<span key={index}>
							{gen} {index < request.genre.length - 1 ? "," : ""}
						</span>
					))}
				</p>
			</div>
			{!approved ? (
				<div className="flex gap-x-[10px]">
					<button
						onClick={onConfirm}
						className="px-10 py-2 text-white bg-primary rounded-[18px]"
					>
						Confirm
					</button>
					<button
						onClick={onDecline}
						className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
					>
						Decline
					</button>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-y-[10px]">
						<h4 className="font-semibold">Status</h4>
						<p className="text-[#92C669]">Added</p>
					</div>
					<div className="flex gap-x-[10px]">
						<button
							onClick={onDiscontinue}
							className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
						>
							Discontinue
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default function Requests() {
	const [showDiscontinueModal, setShowDiscontinueModal] = useState(false)
	const [selectedPodcastForDeletion, setSelectedPodcastForDeletion] =
		useState(null)
	const [loading, setLoading] = useState(false)
	const { mutate } = useSWRConfig()
	const { data: session, update } = useSession()
	const { podcasts, loading: podcastsLoading } = useHostPodcasts()
	const confirmedPodcasts = podcasts?.filter(
		podcast => podcast.hosts.confirmed
	)
	const podcastsMutator = useHostPodcastsMutator()
	const unconfirmedPodcasts = podcasts?.filter(
		podcast => !podcast.hosts.confirmed
	)

	const handleConfirmClick = async podcast => {
		try {
			setLoading(true)
			const updatedPodcast = await changePodcastHostStatus(
				podcast._id,
				true
			)
			podcastsMutator.updatePodcast(updatedPodcast)
			setLoading(false)

			if (session.user?.access?.includes("host")) {
				toast.success("Podcast confirmed successfully.")
			} else {
				toast.success("Podcast confirmed successfully.")
				update({
					access: [...session.user.access, "host"]
				})
				mutate("/api/user")
			}
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	const handleUnconfirmClick = async () => {
		try {
			setLoading(true)
			const updatedPodcast = await changePodcastHostStatus(
				selectedPodcastForDeletion._id,
				false
			)
			podcastsMutator.updatePodcast(updatedPodcast)
			toast.success("Podcast unconfirmed successfully.")
			setLoading(false)
			setShowDiscontinueModal(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	const handleDeclineClick = async podcast => {
		try {
			setLoading(true)
			const updatedPodcast = await declinePodcastHosting(podcast._id)
			podcastsMutator.updatePodcast(updatedPodcast)
			toast.success("Podcast decline successfully")
			setLoading(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	return (
		<div className="flex flex-col gap-y-5">
			<SectionHeading>Host Requests</SectionHeading>
			<p className="text-sm text-gray-600">
				When a podcast owner adds you as a host, a request will be shown
				here for you to approve.
			</p>

			{podcastsLoading || loading ? (
				<Spinner />
			) : (
				<div className="flex flex-col gap-y-5">
					{!(confirmedPodcasts?.length > 0) &&
					!(unconfirmedPodcasts?.length > 0) ? (
						<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
							There is no host request at the moment.
						</div>
					) : (
						<>
							<Table
								className="hidden lg:block"
								// heading="Podcast Requests"
								headers={[
									"name",
									"description",
									"genre",
									"status"
								]}
								fields={[
									"name",
									"description",
									"genre",
									"status"
								]}
								buttons={[
									{
										icon: (
											<Button
												variant={buttonVariants.PRIMARY}
												className="text-xs"
											>
												Confirm
											</Button>
										)
									},
									{
										icon: (
											<Button
												variant={
													buttonVariants.SECONDARY
												}
												className="text-xs"
											>
												Decline
											</Button>
										)
									}
								]}
								buttonFunctions={[
									handleConfirmClick,
									handleDeclineClick
								]}
								data={unconfirmedPodcasts}
								link
								linkParent="/shows/"
							/>
							<div className="flex flex-col gap-5 lg:hidden">
								{unconfirmedPodcasts?.map(podcast => (
									<RequestCard
										key={podcast._id}
										request={podcast}
										onConfirm={() =>
											handleConfirmClick(podcast)
										}
										onDecline={() =>
											handleDeclineClick(podcast)
										}
										approved={false}
									/>
								))}
							</div>
							<SectionHeading>My Hosted PODZ</SectionHeading>
							{showDiscontinueModal && (
								<DeleteConfirmationModal
									message={`Are you sure you want to discontinue from being a host at this podcast?`}
									onClose={() =>
										setShowDiscontinueModal(false)
									}
									onConfirm={handleUnconfirmClick}
									confirmButton="Discontinue"
								/>
							)}
							<Table
								// heading="Podcast Requests"
								className="hidden lg:block"
								headers={["name", "description", "genre", ""]}
								fields={["name", "description", "genre"]}
								buttons={[
									{
										icon: (
											<div className="text-xs text-[#92C669] py-[2px] px-4 rounded-[19px] flex items-center justify-center">
												Added
											</div>
										)
									},
									{
										icon: (
											<div className="text-xs text-white bg-[#4B5563] py-[2px] px-4 rounded-[19px] flex items-center justify-center">
												Discontinue
											</div>
										)
									}
								]}
								buttonFunctions={[
									() => {},
									podcast => {
										setSelectedPodcastForDeletion(podcast)
										setShowDiscontinueModal(true)
									}
								]}
								data={confirmedPodcasts}
								link
								linkParent="/shows/"
							/>
							<div className="flex flex-col gap-5 lg:hidden">
								{confirmedPodcasts?.map(podcast => (
									<RequestCard
										key={podcast._id}
										request={podcast}
										onDiscontinue={() => {
											setSelectedPodcastForDeletion(
												podcast
											)
											setShowDiscontinueModal(true)
										}}
										approved={true}
									/>
								))}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	)
}
