import React, { useEffect, useState } from "react"
import { Wrapper } from "../Layout"
import {
	updateEpisode,
	useEpisode,
	usePreviousEpisodes
} from "@/lib/app/episode"
import { useRouter } from "next/router"
import Spinner from "../common/Spinner"
import Image from "next/image"
import { SectionHeading } from "../common/Typography"
import CustomImage from "../CustomImage/CustomImage"
import { format } from "date-fns"
import Link from "next/link"
import { EpisodeListItems } from "../podcast/list"
import { useCurrentUser } from "@/lib/app/user"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"
import { useSWRConfig } from "swr"

function Episode() {
	const router = useRouter()
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const { episode } = useEpisode(router.query.episodeId)
	const [allGuests, setAllGuests] = useState([])
	const { episodes } = usePreviousEpisodes(router.query.episodeId, 3)
	const { user } = useCurrentUser()
	const { mutate } = useSWRConfig()

	useEffect(() => {
		if (episode) {
			const allGuests = episode.guestUsers ? [...episode.guestUsers] : []
			for (let i = 0; i < episode.guests?.length; i++) {
				if (!episode.guests[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
					allGuests.push(episode.guests[i])
				}
			}
			setAllGuests(allGuests)
		}
	}, [episode])
	return (
		<Wrapper className="p-5">
			{!episode ? (
				<Spinner />
			) : (
				<section className="flex flex-col gap-5">
					<div className="flex flex-row gap-x-2">
						<button
							onClick={() => {
								router.replace(`/shows/${router.query.name}`)
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
						<SectionHeading>All Episodes</SectionHeading>
					</div>
					<div
						className={`w-full flex flex-col md:flex-row md:items-center grow gap-5`}
					>
						<div className="flex flex-col lg:flex-row lg:gap-x-[15px] text-lg lg:items-center">
							<h2 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold leading-10">
								{episode.name}
							</h2>
							<p className="min-w-fit">
								{format(new Date(episode.pubDate), "PP")}
							</p>
						</div>
					</div>
					<div className="p-2 md:p-5 bg-white border border-[#f2f2f2] rounded-[14px]">
						<div className="flex flex-col md:flex-row gap-[30px]">
							<div className="flex items-center justify-center grow">
								<CustomImage
									width={300}
									src={episode.imagePath ?? "/podcast.avif"}
									alt="mockup"
									className="justify-center max-w-[300px]"
								/>
							</div>
							<p className="max-h-[300px] overflow-y-auto h-[300px] text-base md:text-lg hide-scroll-bar scrollbar-thin scrollbar-thumb-primary-400 scrollbar-track-primary-100 break-all p-2">
								{episode.description}
							</p>
						</div>
						<div className="flex flex-col items-center w-full max-w-[570px] lg:flex-row mt-[30px]">
							<div className="w-full">
								<audio
									className="w-full"
									controls
									src={episode.enclosure}
								>
									<a href={episode.enclosure}>
										Download audio
									</a>
								</audio>
							</div>
						</div>
					</div>
					<div className="flex flex-col p-5 bg-white border border-[#f2f2f2] rounded-[14px]">
						<div className="flex text-lg gap-x-[10px]">
							<h4 className="font-extrabold">Guests</h4>
							<p
								className="border-b cursor-pointer text-primary border-primary"
								onClick={async () => {
									try {
										if (!user) {
											return router.replace("/login")
										} else {
											if (
												!user?.access.includes("guest")
											) {
												return setErrorMessage(
													"You do not have guest access."
												)
											}

											const guests = episode.guests?.map(
												guest => guest._id
											)
											if (!guests?.includes(user._id)) {
												await updateEpisode(
													router.query.episodeId,
													{
														...episode,
														guests: guests
															? [
																	...episode.guests,
																	{
																		_id: user._id,
																		confirmed: false
																	}
															  ]
															: [
																	{
																		_id: user._id,
																		confirmed: false
																	}
															  ]
													}
												)
												mutate(
													`/api/episodes/${episode._id}`
												)
												mutate(
													`/api/episodes/${episode._id}/guests`
												)
												setSuccessMessage(
													"You have been added as a guest to this episode."
												)
											} else {
												setErrorMessage(
													"You are already a guest"
												)
											}
										}
									} catch (e) {
										setErrorMessage(e.message)
									}
								}}
							>
								I was a guest
							</p>
						</div>
						{allGuests?.length > 0 ? (
							<div className="flex flex-col sm:flex-row flex-wrap gap-[10px]">
								{allGuests?.map(guest =>
									guest._id?.match(/^[0-9a-fA-F]{24}$/) ? (
										<div
											key={guest._id}
											className="flex flex-row items-center cursor-pointer sm:text-center sm:flex-col gap-x-2"
										>
											<Link
												href={`/profile/${guest._id}`}
												passHref
											>
												<img
													className="w-12 h-12 mt-3 mb-3 rounded-full sm:mx-auto"
													src={
														guest.profilePicture ??
														"/images/default_user.jpg"
													}
													alt="Rounded avatar"
												/>
											</Link>
											<p className="text-lg">
												<Link
													href={`/profile/${guest._id}`}
												>
													{guest.name}
												</Link>{" "}
											</p>
										</div>
									) : (
										<div
											key={guest._id}
											className="flex flex-row items-center cursor-default sm:text-center sm:flex-col gap-x-2"
										>
											<img
												className="w-12 h-12 mt-3 mb-3 rounded-full sm:mx-auto"
												src={"/images/default_user.jpg"}
												alt="Rounded avatar"
											/>
											<p className="text-lg">
												{guest.name}
											</p>
										</div>
									)
								)}
							</div>
						) : (
							<div className="h-[100px] flex items-center justify-center">
								No guests for this episode
							</div>
						)}
					</div>
					<div className="flex flex-col gap-5">
						<h4 className="text-lg font-bold">
							Previous episodes of the show
						</h4>
						{episodes?.map(episode => (
							<div key={episode._id}>
								<EpisodeListItems
									id={episode._id}
									name={episode.name}
									description={episode.description}
									image={
										episode.imagePath ??
										episode.podcast.logoPath
									}
									audioUrl={episode.enclosure}
									date={new Date(episode.pubDate)}
								/>
							</div>
						))}
					</div>
				</section>
			)}
		</Wrapper>
	)
}

export default Episode
