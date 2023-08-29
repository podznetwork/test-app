import CustomImage from "@/components/CustomImage/CustomImage"
import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
import Table from "@/components/common/Table"
import { SectionHeading } from "@/components/common/Typography"
import { useAllMediaZ } from "@/lib/app/mediaz"
import { usePodcasts } from "@/lib/app/podcast"
import { useCurrentUser } from "@/lib/app/user"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

function MediaZPodcastCard({ podcast }) {
	return (
		<div className="w-full p-6 shrink-0 md:w-2/4 lg:w-1/3 md:first:pl-0 first:pt-0 md:pt-0">
			<figure className="relative max-w-sm p-2 transition-all duration-300 rounded-[14px] border border-[#f2f2f2] cursor-pointer filter bg-white">
				<div>
					<Link
						href={`/mediaz/${podcast._id}`}
						className="flex justify-center p-2 grayscale-0 hover:grayscale"
					>
						<a>
							<CustomImage
								divClassName="flex justify-center max-h-[400px]"
								className="text-center"
								src={podcast.logoPath}
								alt="Podcast Logo"
								width={400}
							/>
						</a>
					</Link>
					<div className="bg-white">
						<figcaption className="w-full py-2 pt-1 text-base bg-white min-h-[110px]">
							<div className="col-span-4 pt-1">
								<h4 className="font-bold truncate ...">
									<Link href={`/mediaz/${podcast._id}`}>
										{podcast.name}
									</Link>
								</h4>
							</div>
							<p className="text-xs line-clamp-4">
								{podcast.description}
							</p>
						</figcaption>
					</div>
				</div>
			</figure>
		</div>
	)
}

function MediaZ() {
	const { user } = useCurrentUser()
	const { podcasts } = usePodcasts()

	return user?.access?.includes("admin") ? (
		<AdminMediaZ />
	) : (
		<div className="flex flex-col gap-5">
			<SectionHeading>MediaZ</SectionHeading>
			{podcasts?.length > 0 ? (
				<>
					<p className="text-base lg:text-xl">
						Welcome to MediaZ! Here, you can upload images and
						videos to promote your podcast. Our team will use these
						uploads to create ads and content for social media
						promotion. For more information, refer to terms and
						agreement. Please select PODZ to add your MediaZ.
					</p>
					<div className="flex flex-wrap justify-center w-full mt-6 md:justify-start md:flex-nowrap md:overflow-x-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-white">
						{podcasts?.map(podcast => (
							<MediaZPodcastCard
								key={podcast._id}
								podcast={podcast}
							/>
						))}
					</div>
				</>
			) : (
				<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
					Currenly, there are no podcasts to add mediaZ to.
				</div>
			)}
		</div>
	)
}

function AdminMediaZ() {
	const { podcasts } = usePodcasts()
	const { mediaz } = useAllMediaZ()
	const router = useRouter()
	const [podcastsArray, setPodcastsArray] = useState(null)

	podcasts?.forEach(podcast => {
		podcast.mediaz = 0
		mediaz?.forEach(media => {
			if (media.podcast === podcast._id) {
				podcast.mediaz++
			}
		})
	})

	useEffect(() => {
		if (podcasts) {
			podcasts.sort((a, b) => a.mediaZUpdatedAt - b.mediaZUpdatedAt)
		}
		setPodcastsArray(podcasts)
	}, [podcasts])

	return (
		<div className="flex flex-col gap-5">
			<SectionHeading>Podcasts</SectionHeading>
			{podcasts?.length > 0 ? (
				<>
					<Table
						className="hidden lg:block"
						headers={["name", "amount of content elements"]}
						fields={["name", "mediaz"]}
						link
						buttons={[
							{
								icon: (
									<div className="bg-[#92C669] text-white rounded-[18px] py-[5px] px-[17px]">
										New
									</div>
								)
							}
						]}
						buttonConditions={[podcast => !!podcast.newMedia]}
						data={podcasts}
					/>
					<div className="flex flex-col gap-5 lg:hidden">
						{podcastsArray?.map(podcast => (
							<div
								key={podcast._id}
								className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5"
							>
								{
									<div className="flex items-center gap-x-[10px]">
										<h3 className="font-semibold text-primary">
											{podcast.name}
										</h3>
										{podcast.newMedia && (
											<div className="bg-[#92C669] text-white rounded-[18px] py-[5px] px-[17px]">
												New
											</div>
										)}
									</div>
								}
								<div className="flex flex-col gap-y-[10px]">
									<h4 className="font-semibold">
										Amount of content elements
									</h4>
									<p>{podcast.mediaz}</p>
								</div>
								<div>
									<Button
										onClick={() =>
											router.push(`mediaz/${podcast._id}`)
										}
										variant={buttonVariants.PRIMARY}
									>
										View Gallery
									</Button>
								</div>
							</div>
						))}
					</div>
				</>
			) : (
				<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
					Currenly, there are no podcasts to show
				</div>
			)}
		</div>
	)
}

export default MediaZ
