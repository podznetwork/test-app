import { useEpisodesMutator, useOwnerEpisodes } from "@/lib/app/episode"
import React from "react"
import { useState } from "react"
import PodcastsTable from "./table"

export default function PodcastTables() {
	const ITEMSPERPAGE = 10

	const [page, setPage] = useState(0)
	const { episodesData, loading: episodesLoading } = useOwnerEpisodes({
		page,
		itemsPerPage: ITEMSPERPAGE
	})
	const episodesMutator = useEpisodesMutator(true, page, ITEMSPERPAGE)
	return (
		<>
			<PodcastsTable episodesMutator={episodesMutator} />
			{/* <EpisodesTable
				ITEMSPERPAGE={ITEMSPERPAGE}
				page={page}
				setPage={setPage}
				episodesLoading={episodesLoading}
				episodes={episodesData?.paginatedResults}
				episodesMutator={episodesMutator}
				episodeCount={episodesData?.totalCount[0]?.count}
			/> */}
		</>
	)
}
