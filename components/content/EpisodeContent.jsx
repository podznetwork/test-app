import Link from "next/link"
import Spinner from "../common/Spinner"
import CustomImage from "../CustomImage/CustomImage"
function Items({ episode }) {
	return (
		<div className="grid inline-block grid-cols-1 py-2 w-60 md:w-60">
			<div className="col-span-1 transition-all duration-300 min-h-[200px] max-h-[200px] cursor-pointer filter grayscale-0 hover:grayscale flex items-center justify-center">
				<Link href={`/podcasts/${episode.podcast._id}`}>
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
			<div className="items-center justify-center mt-2 ml-4 text-center">
				<Link href={`/podcasts/${episode.podcast._id}`}>
					<a className="bg-primary hover:bg-[#F0BB9B] text-[#fafafa] hover:text-[#4B5563] text-sm font-medium mr-2 px-2.5 py-0.5 rounded truncate">
						{episode.podcastTitle}
					</a>
				</Link>
				<Link href={`/podcasts/${episode.podcast._id}`}>
					<a className="mt-2 min-h-[60px] max-h-[60px] text-sm font-medium dark:text-white line-clamp-2 text-clip">
						{episode.name}
					</a>
				</Link>
			</div>
		</div>
	)
}

const EpisodeContent = ({ episodes, className, loading }) => {
	return loading ? (
		<Spinner />
	) : (
		<section>
			{episodes != undefined && episodes?.length > 0 ? (
				<div
					className={
						className ??
						"grid grid-cols-2 justify-center sm:grid-cols-4 gap-5 mt-6"
					}
				>
					{episodes?.map(episode => (
						<Items key={episode._id} episode={episode} />
					))}
				</div>
			) : (
				<div className="mt-10 mb-12">No Episodes to show</div>
			)}
		</section>
	)
}

export default EpisodeContent
