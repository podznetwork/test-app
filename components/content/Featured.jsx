import Link from "next/link"
import CustomImage from "../CustomImage/CustomImage"
function Items({ podcast }) {
	return (
		<div>
			<figure className="relative inline-block max-w-sm transition-all duration-300 cursor-pointer w-44 md:w-60 filter grayscale-0 hover:grayscale">
				<Link href={`/shows/${podcast.uId}`}>
					<a>
						<CustomImage
							className="rounded-lg"
							src={podcast.logoPath}
							alt="image description"
							width={250}
						/>
					</a>
				</Link>
				<figcaption className="absolute px-4 py-2 pt-1 text-lg text-white bg-black bottom-6">
					<div className="grid grid-cols-6">
						<div className="col-span-4 pt-1">
							<h4 className="font-bold truncate ...">
								<Link href={`/shows/${podcast.uId}`}>
									{podcast.name}
								</Link>
							</h4>
						</div>
					</div>
					<p className="max-w-full text-xs break-all line-clamp-2">
						{podcast.description}
					</p>
				</figcaption>
			</figure>
		</div>
	)
}
const Featured = ({ podcasts }) => {
	return (
		<section>
			{podcasts != undefined && podcasts?.length > 0 ? (
				<div className="flex py-4 overflow-x-scroll hide-scroll-bar scrollbar-thin scrollbar-thumb-primary-400 scrollbar-track-primary-100">
					<div className="flex flex-nowrap gap-x-10">
						{podcasts?.map(podcast => (
							<Items key={podcast._id} podcast={podcast} />
						))}
					</div>
				</div>
			) : (
				<div className="mt-10 mb-12">No Featured Podcasts</div>
			)}
		</section>
	)
}

export default Featured
