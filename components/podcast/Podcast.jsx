import { refetchEpisodes, usePodcast } from "@/lib/app/podcast"
import { useRouter } from "next/router"
import { SectionHeading } from "../common/Typography"
import Image from "next/image"
import Table from "../common/Table"
import EpisodesTable from "./episode"
import { useState } from "react"
import { useEpisodesMutator, usePodcastEpisodes } from "@/lib/app/episode"
import { toast } from "react-hot-toast"
import PodcastListCard from "./PodcastListCard"
import { EpisodeCard } from "./EpisodeDetails"
import { DeleteConfirmationModal } from "../common/Modal"

const EPISODESPERPAGE = 10

const Podcast = () => {
	const router = useRouter()
	const { podcast } = usePodcast(router.query.id)
	const [page, setPage] = useState(0)
	const [showRefetchModal, setShowRefetchModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const { episodesData, loading: episodesLoading } = usePodcastEpisodes(
		router.query.id,
		page,
		EPISODESPERPAGE
	)
	const episodesMutator = useEpisodesMutator(
		router.query.id,
		page,
		EPISODESPERPAGE
	)

	const refetchAllEpisodes = async event => {
		event.preventDefault()
		try {
			setLoading(true)
			const episodes = await refetchEpisodes()
			episodesMutator.addEpisodes(episodes)
			toast.success("Episodes refetched successfully.")
			setLoading(false)
		} catch (e) {
			console.log(e)
			setLoading(false)
			toast.error(e.message)
		} finally {
			setShowRefetchModal(false)
		}
	}

	return podcast ? (
		<>
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
				<SectionHeading>{podcast.name}</SectionHeading>
			</div>
			<div className="flex flex-col my-4 gap-y-5">
				<Table
					className="hidden lg:block"
					heading="Podcasts"
					headers={[
						"name",
						"description",
						"featured",
						"hosts",
						"genre"
					]}
					fields={[
						"name",
						"description",
						"featured",
						"hostUsers",
						"genre"
					]}
					// buttons={[
					// 	{
					// 		icon: (
					// 			<Image
					// 				src="/images/edit.svg"
					// 				height={16}
					// 				width={16}
					// 				alt="Edit Episode"
					// 			/>
					// 		)
					// 	},
					// 	{
					// 		icon: (
					// 			<Image
					// 				src="/images/delete.svg"
					// 				height={16}
					// 				width={16}
					// 				alt="Edit Episode"
					// 			/>
					// 		)
					// 	}
					// ]}
					// buttons={["Edit", "Delete"]}
					// buttonFunctions={[editPodcast, onDeleteClick]}
					data={[podcast]}
				/>
				<div className="lg:hidden">
					<PodcastListCard podcast={podcast} />
				</div>
				<SectionHeading
					button="Refetch Episodes"
					buttonOnClick={() => setShowRefetchModal(true)}
					loading={loading}
				>
					Episodes
				</SectionHeading>
				{episodesData?.count > 0 && (
					<div className="flex flex-col gap-5 lg:hidden">
						{episodesData?.episodes.map(episode => (
							<EpisodeCard
								link={true}
								key={episode._id}
								episode={episode}
							/>
						))}
					</div>
				)}
				<EpisodesTable
					ITEMSPERPAGE={EPISODESPERPAGE}
					page={page}
					setPage={setPage}
					episodesLoading={episodesLoading}
					episodes={episodesData?.episodes}
					episodesMutator={episodesMutator}
					episodeCount={episodesData?.count}
				/>
				{showRefetchModal && (
					<DeleteConfirmationModal
						loading={loading}
						onClose={() => setShowRefetchModal(false)}
						onConfirm={refetchAllEpisodes}
						message="Are you sure you want to refetch the episodes?"
						confirmButton="Continue"
					/>
				)}
			</div>
		</>
	) : null
}

export default Podcast
