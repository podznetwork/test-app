import {
	deleteEpisode,
	updateEpisode,
	useEpisode,
	useEpisodeGuests
} from "@/lib/app/episode"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { SectionHeading } from "../common/Typography"
import Table from "../common/Table"
import { useCurrentUser, useUsers } from "@/lib/app/user"
import { toast } from "react-hot-toast"
import { Input } from "../common/Input"
import { CreatableSelectInput } from "../common/Input/SelectInput"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { DeleteConfirmationModal } from "../common/Modal"
import { format, set } from "date-fns"
import { useSWRConfig } from "swr"
import clsx from "clsx"

function EditEpisode(props) {
	const { mutate } = useSWRConfig()
	const [loading, setLoading] = useState(false)
	const { showModal, setShowModal, episode } = props
	const nameRef = useRef()
	const descriptionRef = useRef()
	const enclosureRef = useRef()
	const [selectedGuestOptions, setSelectedGuestOptions] = useState(
		episode.allGuests
			? episode.allGuests.map(guest => ({
					value: guest._id,
					label: guest.name
			  }))
			: []
	)
	const [guests, setGuests] = useState(
		episode.guests ? [...episode.guests] : []
	)

	const { users } = useUsers("guest")

	const getGuestUsersOptions = () => {
		const options = users?.map(guest => ({
			value: guest._id,
			label: guest.name
		}))
		return options
	}

	const onSubmit = async event => {
		event.preventDefault()
		try {
			setLoading(true)
			const updatedEpisode = await updateEpisode(episode._id, {
				name: nameRef.current.value,
				description: descriptionRef.current.value,
				guests: guests,
				enclosure: enclosureRef.current.value
			})
			mutate(`/api/episodes/${episode._id}`)
			mutate(`/api/episodes/${episode._id}/guests`)
			setLoading(false)
			toast.success("Episode updated successfully.")
			setShowModal(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	useEffect(() => {
		nameRef.current.value = episode.name
		descriptionRef.current.value = episode.description ?? ""
		enclosureRef.current.value = episode.enclosure
	}, [episode])

	return (
		<>
			<div className="flex flex-row gap-x-2">
				<button
					onClick={() => setShowModal(false)}
					className="flex items-center shrink-0"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading>{episode.name} - episode</SectionHeading>
			</div>
			<div className="flex flex-col w-full gap-5 mt-6 lg:w-1/2">
				<Input
					required
					label="Podcast Episode Name"
					ref={nameRef}
					className="w-full"
					placeholder="Episode Name"
				/>
				<Input
					required
					label="Podcast Episode Description"
					ref={descriptionRef}
					className="w-full"
					placeholder="Description Text"
				/>
				<CreatableSelectInput
					className="w-full"
					label="Guests"
					value={selectedGuestOptions}
					multiSelect={true}
					options={getGuestUsersOptions()}
					onChange={options => {
						setGuests(
							options.map(option => ({
								_id: option.value
							}))
						)
						setSelectedGuestOptions(options)
					}}
				/>
				<Input
					required
					label="Enclosure"
					ref={enclosureRef}
					className="w-full"
					placeholder="https://youtube.com"
				/>
				<div className="flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
					<Button
						onClick={onSubmit}
						loading={loading}
						variant={buttonVariants.PRIMARY}
						className="w-full lg:max-w-[240px]"
					>
						Save
					</Button>
					<Button
						onClick={() => setShowModal(false)}
						variant={buttonVariants.SECONDARY}
						className="w-full lg:max-w-[240px]"
					>
						Cancel
					</Button>
				</div>
			</div>
		</>
	)
}

export function EpisodeCard({
	episode,
	editClick,
	deleteClick,
	showButtons,
	link
}) {
	const router = useRouter()

	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<h3
				className={clsx(
					"font-semibold text-primary",
					link && "cursor-pointer"
				)}
				onClick={() =>
					link && router.push(`/${router.asPath}/${episode._id}`)
				}
			>
				{episode.name}
			</h3>
			<p>{episode.description}</p>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Guests</h4>
				<p>
					{episode?.allGuests?.map((guest, index) => (
						<span key={index}>
							{guest.name}{" "}
							{index < episode.allGuests.length - 1 ? ", " : ""}
						</span>
					))}
				</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Pubdate</h4>
				<p>
					<>
						{format(
							new Date(episode.pubDate),
							"yyyy-MM-dd' 'HH:mm:ss"
						)}
					</>
				</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Genres</h4>
				<p>
					{episode.genre.map((gen, index) => (
						<span key={index}>
							{gen} {index < episode.genre.length - 1 ? "," : ""}
						</span>
					))}
				</p>
			</div>
			{showButtons && (
				<div className="flex gap-x-[10px]">
					<button
						onClick={editClick}
						className="px-10 py-2 text-white bg-primary rounded-[18px]"
					>
						Edit
					</button>
					<button
						onClick={deleteClick}
						className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
					>
						Delete
					</button>
				</div>
			)}
		</div>
	)
}

function GuestCard({ guest, removeGuest }) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<h3 className={clsx("font-semibold text-primary")}>{guest.name}</h3>
			<p>{guest.experience}</p>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Start date</h4>
				<p>
					<>
						{format(
							new Date(guest.startDate),
							"yyyy-MM-dd' 'HH:mm:ss"
						)}
					</>
				</p>
			</div>
			<div className="flex gap-x-[10px]">
				<button
					onClick={removeGuest}
					className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
				>
					Remove
				</button>
			</div>
		</div>
	)
}

function EpisodeDetails() {
	const router = useRouter()
	const { episode, loading } = useEpisode(router.query.episodeId)
	const [episodeData, setEpisodeData] = useState(episode)
	const [showModal, setShowModal] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const [selectedGuest, setSelectedGuest] = useState(null)
	const [showGuestRemoveModal, setShowGuestRemoveModal] = useState(false)
	const { guests } = useEpisodeGuests(router.query.episodeId)
	const { mutate } = useSWRConfig()
	const [deleteLoading, setDeleteLoading] = useState(false)
	useEffect(() => {
		if (episode) {
			const allGuests = episode.guestUsers ? [...episode.guestUsers] : []
			for (let i = 0; i < episode.guests?.length; i++) {
				if (!episode.guests[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
					allGuests.push(episode.guests[i])
				}
			}
			episode.allGuests = allGuests
		}
		setEpisodeData(episode)
	}, [episode, setEpisodeData])
	const { user } = useCurrentUser()

	const onRemoveGuest = async guestId => {
		const updatedEpisode = await updateEpisode(episode._id, {
			name: episode.name,
			description: episode.description,
			enclosure: episode.enclosure,
			guests: episode.guests.filter(guest => guest._id !== guestId)
		})
		setSelectedGuest(null)
		mutate(`/api/episodes/${episode._id}`)
		mutate(`/api/episodes/${episode._id}/guests`)
		setShowGuestRemoveModal(false)
		toast.success("Guest removed successfully!")
	}

	const onDelete = async () => {
		try {
			setDeleteLoading(true)
			await deleteEpisode(episode._id)
			toast.success("Episode deleted successfully.")
			setDeleteLoading(false)
			router.replace(
				user?.access.includes("admin")
					? `/podz-management/${router.query.id}`
					: `/podcasts/${router.query.id}`
			)
		} catch (e) {
			setDeleteLoading(false)
			toast.error(e.message)
		}
	}

	return episodeData ? (
		<>
			{showModal ? (
				<EditEpisode
					episode={episode}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			) : (
				<>
					{showDeleteConfirmationModal && (
						<DeleteConfirmationModal
							message={`Are you sure you want to delete episode "${episode?.name}"?`}
							onClose={() =>
								setShowDeleteConfirmationModal(false)
							}
							onConfirm={onDelete}
							loading={deleteLoading}
						/>
					)}
					{showGuestRemoveModal && (
						<DeleteConfirmationModal
							onClose={() => setShowGuestRemoveModal(false)}
							onConfirm={() =>
								onRemoveGuest(selectedGuest?.guestId)
							}
							confirmButton="Remove"
							message={`Are you sure you want to remove guest ${selectedGuest?.name} from episode ${episode?.name}?`}
						/>
					)}
					<div className="flex flex-row gap-x-2">
						<button
							onClick={() => router.back()}
							className="flex items-center shrink-0"
						>
							<Image
								src="/images/backArrow.svg"
								height={20}
								width={20}
								alt="Go Back"
							/>
						</button>
						<SectionHeading className="truncate">
							{episode?.name}
						</SectionHeading>
					</div>
					<div className="flex flex-col my-4 gap-y-5">
						<Table
							className="hidden lg:block"
							headers={[
								"title",
								"description",
								"guests",
								"pubdate"
							]}
							fields={[
								"name",
								"description",
								"allGuests",
								"pubDate"
							]}
							buttons={[
								{
									icon: (
										<Image
											src="/images/edit.svg"
											height={16}
											width={16}
											alt="Edit Episode"
										/>
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
								() => setShowModal(true),
								() => setShowDeleteConfirmationModal(true)
							]}
							data={[episodeData]}
						/>
						<div className="lg:hidden">
							<EpisodeCard
								showButtons={true}
								episode={episodeData}
								editClick={() => setShowModal(true)}
								deleteClick={() =>
									setShowDeleteConfirmationModal(true)
								}
							/>
						</div>
						{guests && guests.length > 0 && (
							<div className="flex flex-col gap-5">
								<SectionHeading>Guests</SectionHeading>
								<Table
									className="hidden lg:block"
									headers={[
										"name",
										"experience",
										"start date"
									]}
									fields={["name", "experience", "startDate"]}
									buttons={[
										{
											icon: (
												<button
													// onClick={}
													className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
												>
													Remove
												</button>
											)
										}
									]}
									buttonFunctions={[
										guest => {
											setSelectedGuest(guest)
											setShowGuestRemoveModal(true)
										}
									]}
									data={guests}
								/>
								<div className="flex flex-col gap-5 lg:hidden">
									{guests.map(guest => (
										<GuestCard
											key={guest._id}
											guest={guest}
											removeGuest={() => {
												setSelectedGuest(guest)
												setShowGuestRemoveModal(true)
											}}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</>
			)}{" "}
			<></>
		</>
	) : null
}

export default EpisodeDetails
