import { updateRequest, useRequestsMutator } from "@/lib/app/request"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Input, Textarea } from "@/components/common/Input"
import { genreList } from "@/lib/app/episode"
import {
	CreatableSelectInput,
	SelectInput
} from "@/components/common/Input/SelectInput"
import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { useUsers } from "@/lib/app/user"
import { DeleteConfirmationModal } from "../common/Modal"
import { SectionHeading } from "../common/Typography"

export const frequencyOptions = [
	{ label: "Episodic", value: "episodic", isDisabled: true },
	{ label: "Daily", value: "daily" },
	{ label: "Weekly", value: "weekly" },
	{ label: "Bi-Weekly", value: "bi-weekly" },
	{ label: "Monthly", value: "monthly" },
	{ label: "Serial Frequency", value: "monthly", isDisabled: true },
	{ label: "Serial", value: "serial" }
]

export const viewsOptions = [
	{ label: "<1000", value: "<1000" },
	{ label: "1000-2000", value: "1000-2000" },
	{ label: "2000-3000", value: "2000-3000" },
	{ label: "3000+", value: "3000+" }
]

function ViewOwnerRequest({ ownerRequest, setRequest, setShowModal }) {
	const getGenreOptions = () => {
		return genreList.map(genre => ({
			label: genre,
			value: genre
		}))
	}
	const { users } = useUsers("user")
	const [loading, setLoading] = useState(false)
	const requestsMutator = useRequestsMutator()

	const approveRequest = async request => {
		try {
			setLoading(true)
			const updatedRequest = await updateRequest(request._id, {
				status: "approved",
				access: request.access,
				userId: request.userId,
				role: request.role
			})
			requestsMutator.updateRequest(updatedRequest)
			toast.success("Request approved successfully.")
			setLoading(false)
		} catch (e) {
			toast.error(e.message)
			setLoading(false)
		} finally {
			setShowConfirmationModal(false)
			setRequest(null)
			setShowModal(false)
		}
	}

	const declineRequest = async request => {
		try {
			setLoading(true)
			const updatedRequest = await updateRequest(request._id, {
				status: "declined"
			})
			requestsMutator.updateRequest(updatedRequest)
			toast.success("Request declined successfully.")
			setLoading(false)
		} catch (e) {
			toast.error(e.message)
			setLoading(false)
		} finally {
			setShowDeclinationModal(false)
			setRequest(null)
			setShowModal(false)
		}
	}

	const [selectedHostOptions, setSelectedHostOptions] = useState([])
	const [genre, setGenre] = useState([])
	const [hosts, setHosts] = useState([])
	const [showConfirmationModal, setShowConfirmationModal] = useState(false)
	const [showDeclinationModal, setShowDeclinationModal] = useState(false)
	const [views, setViews] = useState(null)
	const [frequency, setFrequency] = useState(null)
	const [startDate, setStartDate] = useState(new Date())
	const podcastNameRef = useRef()
	const podcastDescriptionRef = useRef()
	const websiteUrlRef = useRef()
	const youtubeURLRef = useRef()
	const rssLinkRef = useRef()

	const getHostUsersOptions = () => {
		const hosts = users?.filter(user => user.becomeHost)
		const options = hosts?.map(host => ({
			value: host._id,
			label: host.name
		}))
		return options
	}

	useEffect(() => {
		if (ownerRequest) {
			podcastNameRef.current.value = ownerRequest.podcastName
			podcastDescriptionRef.current.value =
				ownerRequest.podcastDescription
			youtubeURLRef.current.value = ownerRequest.youtubeURL
			setGenre(ownerRequest.genre)
			setHosts(ownerRequest.hosts)
			setFrequency(ownerRequest.frequency)
			setStartDate(new Date(ownerRequest.startDate))
			setViews(ownerRequest.views)
			websiteUrlRef.current.value = ownerRequest.websiteUrl
			rssLinkRef.current.value = ownerRequest.rssLink
		}
	}, [ownerRequest])

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-row w-full gap-x-2">
				<button
					onClick={() => {
						setRequest(null)
						setShowModal(false)
					}}
					className="flex items-center shrink-0"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<div className="items-center lg:flex gap-y-4 lg:gap-x-3">
					<div
						className={`flex flex-col lg:flex-row lg:items-center gap-4`}
					>
						<div>
							<h2 className="text-lg font-medium md:text-[22px]">
								Please review PODZ request
							</h2>
						</div>
					</div>
				</div>
			</div>
			{showConfirmationModal && (
				<DeleteConfirmationModal
					confirmButton="Confirm"
					onClose={() => setShowConfirmationModal(false)}
					onConfirm={() => approveRequest(ownerRequest)}
					message="Are you sure that you want to confirm Podz Request?"
					loading={loading}
				/>
			)}
			{showDeclinationModal && (
				<DeleteConfirmationModal
					confirmButtonClassName="rounded-[14px] bg-black text-white"
					confirmButton="Decline"
					onClose={() => setShowDeclinationModal(false)}
					onConfirm={() => declineRequest(ownerRequest)}
					message="Are you sure that you want to decline Podz Request?"
					loading={loading}
				/>
			)}

			<div className="grid grid-cols-1 gap-3 my-4 md:grid-cols-2">
				<Input
					ref={podcastNameRef}
					disabled
					className="col-span-1"
					label="Podcast Name"
					placeholder="Truth, Lies, Shenanigans"
				/>
				<Input
					disabled
					ref={podcastDescriptionRef}
					className="col-span-1"
					label="Podcast Description"
					placeholder="Description text"
				/>
				<CreatableSelectInput
					disabled
					options={getHostUsersOptions()}
					value={selectedHostOptions}
					multiSelect
					className="col-span-1"
					label="Hosts"
					placeholder="Start writing to select"
				/>
				<SelectInput
					value={frequencyOptions.find(fr => fr.value === frequency)}
					options={frequencyOptions}
					disabled
					className="col-span-1"
					label="Frequency of Episodes"
					placeholder="Select Option"
				/>
				<Input
					disabled
					ref={youtubeURLRef}
					className="col-span-1"
					label="Youtube URL"
					placeholder="https://youtube.com"
				/>
				<SelectInput
					label="Genre"
					value={getGenreOptions().filter(g =>
						genre.includes(g.value)
					)}
					disabled
					multiSelect
					onChange={options => {
						setGenre(options.map(option => option.value))
					}}
					placeholder="Start to write to select"
					options={getGenreOptions()}
				/>
				<SelectInput
					isSearchable
					required
					disabled
					value={viewsOptions.filter(
						option => option.value === views
					)}
					options={viewsOptions}
					className="col-span-1"
					label="Monthly Views/Downloads"
					placeholder="Select"
				/>
				<Input
					htmlType="date"
					value={startDate.toISOString().split("T")[0]}
					selected={startDate}
					disabled
					className="col-span-1"
					label="Start Date"
					placeholder="10/03/2023"
				/>
				<Input
					disabled
					ref={websiteUrlRef}
					className="col-span-1"
					label="Website URL"
					placeholder="https://abc.com"
				/>
				<Input
					disabled
					ref={rssLinkRef}
					className="col-span-1"
					label="RSS Link"
					placeholder="abc/s/1222/podcast"
				/>
			</div>
			<div>
				<div className="mt-4 flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
					<Button
						onClick={() => setShowConfirmationModal(true)}
						loading={loading}
						variant={buttonVariants.PRIMARY}
						className="w-full lg:max-w-[240px]"
					>
						Approve
					</Button>
					<Button
						onClick={() => setShowDeclinationModal(true)}
						className="w-full lg:max-w-[240px] rounded-[14px] bg-black text-white"
					>
						Decline
					</Button>
				</div>
			</div>
		</div>
	)
}

export function ViewGuestRequest({
	guestRequest: request,
	setRequest,
	setShowModal
}) {
	const biographyRef = useRef()
	const experienceRef = useRef()
	const podcastLink = useRef()
	const [loading, setLoading] = useState(false)
	const requestsMutator = useRequestsMutator()
	const [showConfirmationModal, setShowConfirmationModal] = useState(false)
	const [showDeclinationModal, setShowDeclinationModal] = useState(false)

	const approveRequest = async request => {
		try {
			setLoading(true)
			const updatedRequest = await updateRequest(request._id, {
				status: "approved",
				access: request.access,
				userId: request.userId,
				role: request.role
			})
			requestsMutator.updateRequest(updatedRequest)
			toast.success("Request approved successfully.")
			setLoading(false)
		} catch (e) {
			toast.error(e.message)
			setLoading(false)
		} finally {
			setShowConfirmationModal(false)
			setRequest(null)
			setShowModal(false)
		}
	}

	const declineRequest = async request => {
		try {
			setLoading(true)
			const updatedRequest = await updateRequest(request._id, {
				status: "declined"
			})
			requestsMutator.updateRequest(updatedRequest)
			toast.success("Request declined successfully.")
			setLoading(false)
		} catch (e) {
			toast.error(e.message)
			setLoading(false)
		} finally {
			setShowDeclinationModal(false)
			setRequest(null)
			setShowModal(false)
		}
	}

	useEffect(() => {
		if (request) {
			biographyRef.current.value = request.biography
			experienceRef.current.value = request.experience
			podcastLink.current.value = request.podcastLink
		}
	}, [request])

	return (
		<div className="flex flex-col w-full gap-5">
			<div className="flex flex-row w-full gap-x-2">
				<button
					onClick={() => {
						setRequest(null)
						setShowModal(false)
					}}
					className="flex items-center shrink-0"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading>Please review Guest request</SectionHeading>
			</div>
			{showConfirmationModal && (
				<DeleteConfirmationModal
					confirmButton="Confirm"
					onClose={() => setShowConfirmationModal(false)}
					onConfirm={() => approveRequest(request)}
					message="Are you sure that you want to confirm guest Request?"
					loading={loading}
				/>
			)}
			{showDeclinationModal && (
				<DeleteConfirmationModal
					confirmButtonClassName="rounded-[14px] bg-black text-white"
					confirmButton="Decline"
					onClose={() => setShowDeclinationModal(false)}
					onConfirm={() => declineRequest(request)}
					message="Are you sure that you want to decline guest Request?"
					loading={loading}
				/>
			)}
			<form className="flex flex-col gap-5">
				<Textarea
					label="Biography"
					ref={biographyRef}
					type="text"
					placeholder="Your personal biography"
					reqired
				/>
				<Textarea
					label="Previous Experience"
					ref={experienceRef}
					type="text"
					placeholder="Your podcast experience"
					required
				/>
				<Input
					label="Podcast Episode Link"
					htmlType="text"
					ref={podcastLink}
					placeholder="https://abc.com/podcast/123"
					required
				/>
			</form>
			<div>
				<div className="mt-4 flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
					<Button
						onClick={() => setShowConfirmationModal(true)}
						loading={loading}
						variant={buttonVariants.PRIMARY}
						className="w-full lg:max-w-[240px]"
					>
						Approve
					</Button>
					<Button
						onClick={() => setShowDeclinationModal(true)}
						className="w-full lg:max-w-[240px] rounded-[14px] bg-black text-white"
					>
						Decline
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ViewOwnerRequest
