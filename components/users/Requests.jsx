import {
	deleteRequest,
	updateRequest,
	useRequests,
	useRequestsMutator
} from "@/lib/app/request"
import { format, set } from "date-fns"
import { useState } from "react"
import { toast } from "react-hot-toast"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import Image from "next/image"
import ViewOwnerRequest, { ViewGuestRequest } from "./ViewRequest"
import { DeleteConfirmationModal } from "../common/Modal"

function UserCard({ request, viewClick, removeClick, restoreClick }) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-primary">{request.name}</h3>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Email</h4>
				<p>{request.email}</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Role</h4>
				<p>{request.role}</p>
			</div>
			{request.status === "declined" ? (
				<div className="flex gap-x-[10px]">
					<button
						onClick={restoreClick}
						className="px-10 py-2 text-white bg-primary rounded-[18px]"
					>
						Restore Request
					</button>
				</div>
			) : (
				<div className="flex gap-x-[10px]">
					<button
						onClick={viewClick}
						className="px-10 py-2 text-white bg-primary rounded-[18px]"
					>
						Review Request
					</button>
					<button
						onClick={removeClick}
						className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
					>
						Delete
					</button>
				</div>
			)}
		</div>
	)
}

function Users() {
	const { requests, loading: requestsLoading } = useRequests()
	const unapprovedRequests = requests?.filter(
		request => request.status === "pending"
	)
	const declinedRequests = requests?.filter(
		request => request.status === "declined"
	)

	const requestsMutator = useRequestsMutator()

	const [loading, setLoading] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const [selectedRequest, setSelectedRequest] = useState(null)
	const [showGuestModal, setShowGuestModal] = useState(false)
	const [showOwnerModal, setShowOwnerModal] = useState(false)

	const removeRequest = async request => {
		try {
			setLoading(true)
			await deleteRequest(request._id)
			requestsMutator.removeRequest(request)
			toast.success("Request removed successfully.")
			setLoading(false)
		} catch (e) {
			toast.error(e.message)
			setLoading(false)
		}
	}

	const handleRemoveClick = request => {
		setSelectedRequest(request)
		setShowDeleteConfirmationModal(true)
	}

	const restoreDeclinedRequest = async request => {
		try {
			setLoading(true)
			const updatedRequest = await updateRequest(request._id, {
				status: "pending"
			})
			requestsMutator.updateRequest(updatedRequest)
			toast.success("Request restored successfully.")
			setLoading(false)
		} catch (e) {
			toast.error(e.message)
			setLoading(false)
		}
	}

	const viewRequest = async request => {
		if (request.role === "guest") {
			setShowGuestModal(true)
		} else {
			setShowOwnerModal(true)
		}
		setSelectedRequest(request)
	}

	if (showOwnerModal) {
		return (
			<ViewOwnerRequest
				setShowModal={setShowOwnerModal}
				setRequest={setSelectedRequest}
				ownerRequest={selectedRequest}
			/>
		)
	}

	if (showGuestModal) {
		return (
			<ViewGuestRequest
				setRequest={setSelectedRequest}
				setShowModal={setShowGuestModal}
				guestRequest={selectedRequest}
			/>
		)
	}

	return (
		<>
			<section className="flex flex-col gap-5">
				<SectionHeading>User Requests</SectionHeading>
				{requestsLoading ? (
					<Spinner />
				) : (
					<>
						{unapprovedRequests?.length > 0 ? (
							<>
								<Table
									className="hidden lg:block"
									headers={[
										"name",
										"email",
										"role",
										"status"
									]}
									fields={["name", "email", "role", "status"]}
									buttons={[
										{
											icon: (
												<Button
													className="rounded-[18px] w-[200px]"
													variant={
														buttonVariants.PRIMARY
													}
												>
													Review Request
												</Button>
											)
										},
										{
											icon: (
												<Image
													src="/images/delete.svg"
													height={16}
													width={16}
													alt="Edit Episode"
												/>
											)
										}
									]}
									buttonFunctions={[
										viewRequest,
										handleRemoveClick
									]}
									data={unapprovedRequests}
								/>
								<div className="flex flex-col gap-5 lg:hidden">
									{unapprovedRequests?.map(request => (
										<UserCard
											key={request._id}
											request={request}
											viewClick={() =>
												viewRequest(request)
											}
											removeClick={() =>
												handleRemoveClick(request)
											}
										/>
									))}
								</div>
							</>
						) : (
							<div className="flex bg-white rounded-[14px] min-h-[300px] items-center justify-center">
								Currenly, there are no user requests to show.
							</div>
						)}
					</>
				)}
				{showDeleteConfirmationModal && (
					<DeleteConfirmationModal
						onClose={() => setShowDeleteConfirmationModal(false)}
						onConfirm={async () => {
							await removeRequest(selectedRequest)
							setSelectedRequest(null)
							setShowDeleteConfirmationModal(false)
						}}
						message="Are you sure that you want to delete this request?"
						loading={loading}
					/>
				)}
				<SectionHeading>Declined Requests</SectionHeading>
				{declinedRequests?.length > 0 ? (
					<>
						<Table
							className="hidden lg:block"
							headers={["name", "email", "role", "status"]}
							fields={["name", "email", "role", "status"]}
							buttons={[
								{
									icon: (
										<Button
											className="rounded-[18px]"
											variant={buttonVariants.PRIMARY}
										>
											Restore
										</Button>
									)
								}
							]}
							buttonFunctions={[restoreDeclinedRequest]}
							data={declinedRequests}
						/>
						<div className="flex flex-col gap-5 lg:hidden">
							{declinedRequests?.map(request => (
								<UserCard
									key={request._id}
									request={request}
									restoreClick={() =>
										restoreDeclinedRequest(request)
									}
								/>
							))}
						</div>
					</>
				) : (
					<div className="flex bg-white rounded-[14px] min-h-[300px] items-center justify-center">
						Currenly, there are no declined requests to show.
					</div>
				)}
			</section>
		</>
	)
}

export default Users
