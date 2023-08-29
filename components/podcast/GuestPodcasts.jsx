import React from "react"
import { SectionHeading } from "../common/Typography"
import { usePublicGuestEpisodes } from "@/lib/app/episode"
import { useCurrentUser } from "@/lib/app/user"
import Table from "../common/Table"

export function EpisodeCard({ episode }) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<h3 className="font-semibold text-primary">{episode.name}</h3>
			<p>{episode.description}</p>
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
		</div>
	)
}

function GuestPodcasts() {
	const { user } = useCurrentUser()
	const { episodes } = usePublicGuestEpisodes(user?._id)

	return (
		<div className="flex flex-col gap-5">
			<SectionHeading>Guest PODZ episodes</SectionHeading>
			<p className="text-sm text-gray-600">
				When a podcast owner adds you as a guest on an episode, it will
				be shown here.
			</p>
			<Table
				className="hidden lg:block"
				headers={["name", "description", "genre"]}
				fields={["name", "description", "genre"]}
				data={episodes ?? []}
			/>
			<div className="flex flex-col gap-5 lg:hidden">
				{episodes?.map(episode => (
					<EpisodeCard key={episode._id} episode={episode} />
				))}
			</div>
		</div>
	)
}

export default GuestPodcasts
