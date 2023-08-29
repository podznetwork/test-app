import {
	updatePodcast,
	useAllPodcasts,
	usePodcastsMutator
} from "@/lib/app/podcast"
import { useState } from "react"
import { SelectInput } from "../common/Input/SelectInput"
import { LoadingDots } from "../common/LoadingDots"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

function AddItem(props) {
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const { showModal, setShowModal, podcastMutator, loading, setLoading } =
		props
	const [selectedPodcast, setSelectedPodcast] = useState(false)

	const { podcasts } = useAllPodcasts()
	const unfeaturedPodcasts = podcasts?.filter(podcast => !podcast.featured)
	const podcastOptions = unfeaturedPodcasts?.map(podcast => ({
		label: podcast.name,
		value: podcast._id
	}))

	const onSubmit = async event => {
		event.preventDefault()
		try {
			setLoading(true)
			const updatedPodcast = await updatePodcast(selectedPodcast, {
				featured: true
			})
			podcastMutator.updatePodcast(updatedPodcast)
			setLoading(false)
			setShowModal(false)
			setSuccessMessage("Podcast featured successfully.")
		} catch (e) {
			setErrorMessage(e.message)
		}
	}

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
						<h3 className="text-xl font-semibold">
							Add new Featured Podcast
						</h3>
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
										Podcast
									</label>
									<SelectInput
										onChange={option =>
											setSelectedPodcast(option.value)
										}
										options={podcastOptions}
									/>
								</div>
							</div>
						</form>
					</div>

					<div className="grid p-6 border-t border-gray-200 rounded-b place-items-end">
						<button
							onClick={onSubmit}
							className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
							type="submit"
						>
							{loading ? <LoadingDots /> : "Save"}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
function EditFeatured() {
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const { podcasts, loading: podcastsLoading } = useAllPodcasts()
	const podcastMutator = usePodcastsMutator("/all-podcasts")

	const featuredPodcasts = podcasts?.filter(podcast => podcast.featured)

	const unfeaturePodcast = async podcast => {
		try {
			const updatedPodcast = await updatePodcast(podcast._id, {
				featured: false
			})
			podcastMutator.updatePodcast(updatedPodcast)
			setSuccessMessage("Podcast unfeatured successfully.")
		} catch (e) {
			setErrorMessage(e.message)
		}
	}

	return (
		<section>
			<div className="grid grid-cols-2 pt-10 pb-5">
				<SectionHeading button="Add new featured items">
					Featured Items
				</SectionHeading>
				{showModal ? (
					<AddItem
						showModal={showModal}
						setShowModal={setShowModal}
						podcastMutator={podcastMutator}
						loading={loading}
						setLoading={setLoading}
					/>
				) : null}
				{/* <div className="flex justify-end">
					<button
						type="button"
						className="text-white  bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
						onClick={() => setShowModal(true)}
					>
						Add new item
					</button>
				</div> */}
			</div>
			<section>
				{podcastsLoading ? (
					<Spinner />
				) : (
					<Table
						heading="Featured Items"
						headers={["name", "description", "hosts", "genre"]}
						fields={["name", "description", "hosts", "genre"]}
						buttons={[
							{
								icon: (
									<Button
										className="text-xs"
										variant={buttonVariants.PRIMARY}
									>
										Unfeature
									</Button>
								)
							}
						]}
						buttonFunctions={[unfeaturePodcast]}
						data={featuredPodcasts}
					/>
				)}
			</section>
		</section>
	)
}

export default EditFeatured
