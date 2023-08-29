import {
	createNumberArray,
	createPages,
	usePodcastEpisodes
} from "@/lib/app/episode"
import { useOutsideClickDetector } from "@/lib/app/hooks"
import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"
import Spinner from "../common/Spinner"
import { PlayAudio } from "../content/Recent"
import CustomImage from "../CustomImage/CustomImage"
import { useRouter } from "next/router"
function EpisodeModal({
	setShowModal,
	name,
	description,
	image,
	audioUrl,
	date
}) {
	const modalRef = useRef()

	useOutsideClickDetector(null, {
		containerRefToIgnore: modalRef,
		onOutsideClick: () => setShowModal(false)
	})

	return (
		<div
			className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 md:inset-0 justify-center items-center h-modal sm:h-screen flex bg-black/[0.5] z-[150]"
			id="add-user-modal"
			aria-modal="true"
			role="dialog"
		>
			<div
				ref={modalRef}
				className="relative w-full h-full max-w-2xl px-4 md:h-auto"
			>
				<div className="relative bg-white rounded-lg shadow">
					<div className="flex items-start justify-between p-5 border-b rounded-t">
						<h3 className="text-xl font-semibold truncate ...">
							{name}
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
						{/* <div>
							<CustomImage
								src={image}
								alt="Default avatar"
								width={350}
								className="mx-auto"
							/>
						</div> */}
						<div>
							<div className="bottom-0 flex flex-col items-center w-full lg:flex-row">
								{PlayAudio(audioUrl)}
								<p className="mt-4 lg:mt-0 ml-4 w-[150px] text-center lg:text-left">
									{format(date, "PP")}
								</p>
							</div>
						</div>
						<div className="h-[250px] py-2 overflow-auto break-all">
							{description}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function EpisodeListItems({
	id,
	name,
	description,
	image,
	audioUrl,
	date
}) {
	const [showModal, setShowModal] = useState(false)
	const router = useRouter()
	return (
		<>
			{showModal && (
				<EpisodeModal
					setShowModal={setShowModal}
					name={name}
					description={description}
					image={image}
					audioUrl={audioUrl}
					date={date}
				/>
			)}

			<div
				className="hover:bg-[#d4d4d4] bg-white flex flex-col sm:flex-row p-8 mt-6 cursor-pointer"
				onClick={() => router.push(`/shows/${router.query.name}/${id}`)}
			>
				<div className="min-w-[157px] max-w-[157px] items-center flex">
					<CustomImage
						divClassName={"hidden sm:block"}
						className="hidden sm:block"
						src={image}
						alt="Default avatar"
						width={157}
					/>
				</div>
				<CustomImage
					divClassName={"sm:hidden"}
					className="sm:hidden"
					src={image}
					alt="Default avatar"
					width={300}
				/>

				<div className="relative flex flex-col col-span-12 gap-5 pl-8 mt-4 lg:mt-0 sm:col-span-10">
					<div className="flex flex-col lg:flex-row lg:gap-x-[15px] text-lg items-baseline">
						<h1 className="text-lg font-semibold leading-none leading-5 tracking-tight dark:text-white">
							{name}
						</h1>
						<p className="min-w-fit">{format(date, "PP")}</p>
					</div>

					<p className="mb-4 lg:mb-0 h-[100px] line-clamp-4">
						{description}
					</p>
					<div className="flex flex-col items-center w-full max-w-[570px] lg:flex-row">
						{PlayAudio(audioUrl)}
					</div>
				</div>
			</div>
		</>
	)
}
function PodcastList({ podcastId }) {
	const ITEMSPERPAGE = 10

	const [page, setPage] = useState(0)
	const { episodesData, loading: episodesLoading } = usePodcastEpisodes(
		podcastId,
		page,
		ITEMSPERPAGE
	)

	const totalPages = Math.ceil(episodesData?.count / ITEMSPERPAGE)
	const [pageNumbers, setPageNumbers] = useState(
		totalPages > 5
			? [1, 2, "...", totalPages - 1, totalPages]
			: createNumberArray(1, totalPages)
	)

	const pageBtnStyles = {
		active: "first:ml-0 mt-2 ml-1 py-2 w-[60px] rounded border border-primary-500 bg-primary-200",
		inactive:
			"first:ml-0 mt-2 ml-1 py-2 w-[60px] rounded border border-primary-500 hover:bg-primary-100"
	}

	useEffect(() => {
		createPages(page + 1, totalPages, setPageNumbers)
	}, [page, totalPages])

	return episodesLoading ? (
		<Spinner />
	) : (
		<section>
			{episodesData?.episodes?.map(episode => (
				<div key={episode._id}>
					<EpisodeListItems
						id={episode._id}
						name={episode.name}
						description={episode.description}
						image={episode.imagePath ?? episode.podcast.logoPath}
						audioUrl={episode.enclosure}
						date={new Date(episode.pubDate)}
					/>
				</div>
			))}
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
					<span className="rotate-180 material-icons ">Previous</span>
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
					<span className="rotate-180 material-icons ">Next</span>
				</button>
			</div>
		</section>
	)
}

export default PodcastList
