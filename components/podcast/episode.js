import {
	createNumberArray,
	createPages,
	deleteEpisode,
	updateEpisode
} from "@/lib/app/episode"
import { refetchEpisodes } from "@/lib/app/podcast"
import { useUsers } from "@/lib/app/user"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import CreatableSelect from "react-select/creatable"
import { LoadingDots } from "../common/LoadingDots"
import { DeleteConfirmationModal } from "../common/Modal"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import Image from "next/image"

function EditItem(props) {
	const {
		showModal,
		setShowModal,
		episode,
		episodesMutator,
		setLoading,
		loading
	} = props
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
		const options = users.map(guest => ({
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
			episodesMutator.editEpisode(updatedEpisode)
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
	}, [])

	return (
		<div
			className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center h-modal sm:h-full flex bg-black/[0.5]"
			id="add-user-modal"
			aria-modal="true"
			role="dialog"
		>
			<div className="relative w-full h-full max-w-2xl px-4 md:h-auto">
				<div className="relative bg-white rounded-lg shadow">
					<div className="flex items-start justify-between p-5 border-b rounded-t">
						<h3 className="text-xl font-semibold">Edit episode</h3>
						<button
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
							data-modal-toggle="add-user-modal"
							onClick={() => setShowModal(false)}
						>
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
					</div>

					<div className="p-6 space-y-6">
						<form>
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-3">
									<label
										htmlFor="first-name"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										Name
									</label>
									<input
										ref={nameRef}
										type="text"
										name="first-name"
										id="first-name"
										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
										placeholder="The Red Eyes"
										required
									/>
								</div>
								<div className="col-span-6 sm:col-span-3">
									<label
										htmlFor="last-name"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										Description
									</label>
									<input
										ref={descriptionRef}
										type="text"
										name="last-name"
										id="last-name"
										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
										placeholder="Episode Description"
										required
									/>
								</div>
								<div className="col-span-6 sm:col-span-3">
									<label className="block mb-2 text-sm font-medium text-gray-900">
										Guests
									</label>
									{users && (
										<CreatableSelect
											required
											value={selectedGuestOptions}
											isMulti
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
									)}
								</div>
								<div className="col-span-6 sm:col-span-3">
									<label
										htmlFor="department"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										Enclosure
									</label>
									<input
										ref={enclosureRef}
										type="text"
										name="department"
										id="department"
										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
										placeholder="Development"
										required
									/>
								</div>
							</div>
						</form>
					</div>

					<div className="grid p-6 border-t border-gray-200 rounded-b place-items-start">
						<button
							className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
							type="submit"
							onClick={onSubmit}
						>
							{loading ? <LoadingDots /> : <span>Save</span>}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
function EpisodesTable({
	episodes,
	episodesMutator,
	episodesLoading,
	page,
	setPage,
	episodeCount,
	ITEMSPERPAGE
}) {
	const pageBtnStyles = {
		active: "first:ml-0 mt-2 ml-1 py-2 w-[60px] rounded border border-primary-500 bg-primary-200",
		inactive:
			"first:ml-0 mt-2 ml-1 py-2 w-[60px] rounded border border-primary-500 hover:bg-primary-100"
	}
	const totalPages = Math.ceil(episodeCount / ITEMSPERPAGE)

	const [loading, setLoading] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [selectedEpisodeForEdit, setSelectedEpisodeForEdit] = useState(null)
	const [selectedEpisodeForDeletion, setSelectedEpisodeForDeletion] =
		useState(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [pageNumbers, setPageNumbers] = useState(
		totalPages > 5
			? [1, 2, "...", totalPages - 1, totalPages]
			: createNumberArray(1, totalPages)
	)

	const onEdit = episode => {
		setSelectedEpisodeForEdit(episode)
		setShowModal(true)
	}

	episodes?.forEach(episode => {
		const allGuests = episode.guestUsers ? [...episode.guestUsers] : []
		for (let i = 0; i < episode.guests?.length; i++) {
			if (!episode.guests[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
				allGuests.push(episode.guests[i])
			}
		}
		episode.allGuests = allGuests
	})

	const onDeleteClick = episode => {
		setSelectedEpisodeForDeletion(episode)
		setShowDeleteModal(true)
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await deleteEpisode(selectedEpisodeForDeletion._id)
			episodesMutator.deleteEpisode(selectedEpisodeForDeletion._id)
			toast.success("Episode deleted successfully.")
			setShowDeleteModal(false)
			setLoading(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	useEffect(() => {
		createPages(page + 1, totalPages, setPageNumbers)
	}, [page, totalPages])

	return (
		<section>
			<div className="grid grid-cols-2">
				{showDeleteModal && (
					<DeleteConfirmationModal
						heading="Delete Episode"
						message="Are you sure that you want to delete this episode?"
						onClose={() => setShowDeleteModal(false)}
						onConfirm={onDelete}
						loading={loading}
					/>
				)}
				{showModal ? (
					<EditItem
						loading={loading}
						setLoading={setLoading}
						episode={selectedEpisodeForEdit}
						episodesMutator={episodesMutator}
						showModal={showModal}
						setShowModal={setShowModal}
					/>
				) : null}
				{/* <div className="flex justify-end">
					<button
						type="button"
						className="text-white  bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
						// onClick={() => setShowModal(true)}
						onClick={refetchAllEpisodes}
					>
						Refetch Episodes
					</button>
				</div> */}
			</div>
			<section>
				{episodesLoading || loading ? (
					<Spinner />
				) : (
					<div className="mb-4">
						<Table
							className="hidden lg:block"
							link={true}
							heading="Podcast Episodes"
							headers={[
								"title",
								"description",
								"Guests",
								"pubDate"
							]}
							fields={[
								"name",
								"description",
								"guestUsers",
								"pubDate"
							]}
							// buttons={[
							// 	{
							// 		label: "Edit",
							// 		icon: (
							// 			<Image
							// 				src="/images/edit.svg"
							// 				height={14}
							// 				width={14}
							// 				alt="Edit Episode"
							// 			/>
							// 		)
							// 	},
							// 	{
							// 		label: "Delete",
							// 		icon: (
							// 			<Image
							// 				src="/images/delete.svg"
							// 				height={14}
							// 				width={14}
							// 				alt="Edit Episode"
							// 			/>
							// 		)
							// 	}
							// ]}
							// buttonFunctions={[onEdit, onDeleteClick]}
							data={episodes}
						/>
						<div className="mt-4">
							<button
								className={
									page === 0
										? "hidden"
										: "ml-1 w-[80px] py-2 bg-primary rounded text-[#ffff]"
								}
								onClick={() => setPage(page - 1)}
							>
								<span className="sr-only">Previous</span>
								<span className="rotate-180 material-icons ">
									Previous
								</span>
							</button>
							{pageNumbers?.map(pageNum => (
								<button
									disabled={pageNum == "..."}
									className={
										pageNum === page + 1
											? pageBtnStyles.active
											: pageNum == "..."
											? pageBtnStyles.inactive +
											  " cursor-default border-0 hover:bg-[#fff]"
											: pageBtnStyles.inactive
									}
									key={pageNum}
									onClick={() => setPage(pageNum - 1)}
								>
									{pageNum}
								</button>
							))}
							<button
								className={
									page === totalPages - 1
										? "hidden"
										: "ml-1 w-[80px] py-2 bg-primary rounded text-[#ffff]"
								}
								onClick={() => setPage(page + 1)}
							>
								<span className="sr-only">Next</span>
								<span className="rotate-180 material-icons ">
									Next
								</span>
							</button>
						</div>
					</div>
				)}
			</section>
		</section>
	)
}

export default EpisodesTable
