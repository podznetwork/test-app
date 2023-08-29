import Link from "next/link"
import { useEffect, useRef } from "react"
import Spinner from "../common/Spinner"
import CustomImage from "../CustomImage/CustomImage"
export const PlayAudio = url => {
	const audioRef = useRef()

	useEffect(() => {
		if (audioRef) {
			audioRef.current.addEventListener(
				"play",
				function (e) {
					var audios = document.getElementsByTagName("audio")
					for (var i = 0, len = audios.length; i < len; i++) {
						if (audios[i] != e.target) {
							audios[i].pause()
						}
					}
				},
				true
			)
		}
	}, [audioRef])

	return (
		<div className="w-full">
			<audio ref={audioRef} className="w-full" controls src={url}>
				<a href={url}>Download audio</a>
			</audio>
		</div>
	)
}

function NewItems({ episode }) {
	return (
		<div className="grid inline-block grid-cols-1 py-2 w-60 md:w-60">
			<div className="col-span-1 transition-all duration-300 min-h-[200px] max-h-[200px] cursor-pointer filter grayscale-0 hover:grayscale flex items-center justify-center">
				<Link href={`/shows/${episode.podcast.uId}`}>
					<a>
						<CustomImage
							className="mx-auto rounded-lg"
							width={200}
							src={
								episode.imagePath
									? episode.imagePath
									: episode.podcast.logoPath ??
									  "/content-gallery-3.png"
							}
						/>
					</a>
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center mt-2 ml-4 text-center">
				<Link href={`/shows/${episode.podcast.uId}`}>
					<div className="bg-primary hover:bg-[#F0BB9B] text-[#fafafa] hover:text-[#4B5563] text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
						{episode.podcastTitle}
					</div>
				</Link>
				<Link href={`/shows/${episode.podcast.uId}`}>
					<a className="mt-2 min-h-[60px] max-h-[60px] text-sm font-medium dark:text-white line-clamp-2 text-clip">
						{episode.name}
					</a>
				</Link>
				{/* <p className="mt-5 text-sm font-normal text-gray-500 dark:text-gray-400">
					{episode.podcast.description.length > 100
						? `${episode.podcast.description.substring(0, 100)}...`
						: episode.podcast.description}
				</p> */}
				<div className="mt-auto h-[50px] w-full">
					{PlayAudio(episode.enclosure)}
				</div>
			</div>
		</div>
	)
}

const Recent = ({ episodes, episodesLoading, selectedGenre }) => {
	return (
		<section>
			{episodesLoading ? (
				<Spinner />
			) : episodes != undefined && episodes?.length > 0 ? (
				<div className="flex py-4 overflow-x-scroll hide-scroll-bar scrollbar-thin scrollbar-thumb-primary-400 scrollbar-track-primary-100">
					<div className="flex flex-nowrap gap-x-8 md:gap-x-8">
						{episodes?.map(episode => (
							// <Items key={episode._id} episode={episode} />
							<NewItems key={episode._id} episode={episode} />
						))}
					</div>
				</div>
			) : selectedGenre !== "Default" && episodes.length < 1 ? (
				<div className="mt-10 mb-10">
					No episode found for genre:{" "}
					<span className="font-semibold">{selectedGenre}</span>
				</div>
			) : (
				<div className="mt-10 mb-10">No Recent Episodes</div>
			)}
		</section>
	)
}

export default Recent
