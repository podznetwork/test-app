import {
	useFollowedPodcasts,
	useFollowedPodcastsMutator
} from "@/lib/app/podcast"
import { useRequest } from "@/lib/app/request"
import { isUser, unfollowPodcast, useCurrentUser } from "@/lib/app/user"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"
import CustomImage from "../CustomImage/CustomImage"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import Spinner from "../common/Spinner"
import { SectionHeading } from "../common/Typography"
export function PodcastCardItem({ podcast, handleUnfollow, editable }) {
	const allHosts = [...podcast.hostUsers]
	for (let i = 0; i < podcast.hosts.length; i++) {
		if (!podcast.hosts[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
			allHosts.push(podcast.hosts[i])
		}
	}

	const router = useRouter()

	podcast.allHosts = allHosts
	return (
		<div className="w-full p-6 shrink-0 md:w-2/4 lg:w-1/3 md:first:pl-0 first:pt-0 md:pt-0">
			<figure className="mx-auto relative max-w-sm p-2 transition-all duration-300 rounded-[14px] border border-[#f2f2f2] cursor-pointer filter bg-white mx-auto">
				{editable && (
					<button
						onClick={() => handleUnfollow(podcast._id)}
						className="absolute z-10 flex items-center w-10 h-10 p-2 right-2 top-2"
					>
						<CustomImage
							alt="Like button"
							width={50}
							height={50}
							src="/images/heart.svg"
						/>
					</button>
				)}
				<div>
					<div
						onClick={() => router.push(`/shows/${podcast.uId}`)}
						className="flex justify-center items-center grayscale-0 hover:grayscale h-max-[320px] h-[320px] h-min-[320px]"
					>
						<a className="flex items-center justify-center w-full h-full">
							<img
								src={podcast.logoPath}
								alt="Podcast Logo"
								className="w-full max-h-full"
							/>
						</a>
					</div>
					<div className="bg-white">
						<figcaption className="w-full py-2 pt-1 text-base bg-white min-h-[110px]">
							<div className="col-span-4 pt-1">
								<h4 className="font-bold truncate ...">
									<Link href={`/shows/${podcast.uId}`}>
										{podcast.name}
									</Link>
								</h4>
							</div>
							<p className="text-xs line-clamp-4">
								{podcast.description}
							</p>
						</figcaption>
						<div>
							<div className="flex">
								{podcast.allHosts?.map(host => (
									<div
										key={host._id}
										className="border-2 rounded-full border-primary w-[40px] h-[40px] -translate-x-2 first:translate-x-0"
									>
										{isUser(host._id) ? (
											<Link
												passHref
												href={`/profile/${host._id}`}
											>
												<Image
													alt="Host Profile Picture"
													className="rounded-full"
													src={
														host.profilePicture ??
														"/images/default_user.jpg"
													}
													width={40}
													height={40}
												/>
											</Link>
										) : (
											<Image
												alt="Host Profile Picture"
												className="rounded-full"
												src={
													host.profilePicture ??
													"/images/default_user.jpg"
												}
												width={40}
												height={40}
											/>
										)}
									</div>
								))}
								<div
									className={`flex flex-col justify-center ${
										podcast.hosts.length <= 1 ? "ml-2" : ""
									}`}
								>
									<h4 className="font-semibold">Hosted By</h4>
									<div className="flex">
										{podcast.allHosts?.map(host => (
											<p
												key={host._id}
												className="text-xs after:content-[','] after:mx-1 last:after:content-['']"
											>
												{isUser(host._id) ? (
													<Link
														passHref
														href={`/profile/${host._id}`}
													>
														{host.name}
													</Link>
												) : (
													host.name
												)}
											</p>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</figure>
		</div>
	)
}
const OverviewContent = ({ className }) => {
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const { user } = useCurrentUser()
	const { podcasts, loading } = useFollowedPodcasts()
	const followedPodcastMutator = useFollowedPodcastsMutator()
	const { mutate } = useSWRConfig()
	const { request: guestRequest } = useRequest("guest")
	const router = useRouter()

	const handleUnfollow = async podcastId => {
		try {
			await unfollowPodcast(podcastId)
			followedPodcastMutator.unfollowPodcast(podcastId)
			mutate(`/api/podcasts/${podcastId}/follow`)
			setSuccessMessage("Podcast unfollowed successfully.")
		} catch (e) {
			setErrorMessage(e.message)
		}
	}

	return loading ? (
		<Spinner />
	) : (
		<section>
			<div className="flex flex-col gap-4 lg:items-center lg:flex-row">
				<SectionHeading
					replaceClassName="w-auto flex flex-col lg:flex-row lg:items-center gap-4"
					button={!guestRequest && "Join our guest network"}
					buttonOnClick={() =>
						!user?.access.includes("guest") &&
						router.push("/requests/access/guest")
					}
				>
					My FAVZ
				</SectionHeading>
				{guestRequest?.status === "pending" && (
					<div className="flex items-center text-sm py-2 px-8 rounded-[19px] bg-[#AF7F68] text-white w-full lg:w-fit justify-center">
						Guest role pending
					</div>
				)}
			</div>
			{podcasts != undefined && podcasts?.length > 0 ? (
				<div
					className={
						className ??
						"w-full flex justify-center md:justify-start mt-6 flex-wrap md:flex-nowrap md:overflow-x-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-white"
					}
				>
					{podcasts?.map(podcast => (
						<PodcastCardItem
							editable={true}
							key={podcast._id}
							podcast={podcast}
							handleUnfollow={handleUnfollow}
						/>
					))}
				</div>
			) : (
				<div className="bg-white rounded-[14px] border border-[#f2f2f2] mt-6 p-14 text-center">
					<p className="mb-10">
						Find your favourite podcasts from the list from our
						website
					</p>
					<Image
						src="/images/no_podcast.png"
						width={400}
						height={150}
						alt="No Podcasts to show"
					/>
				</div>
			)}
			<div className="mt-6 text-center">
				<Button
					className="min-w-[180px]"
					variant={buttonVariants.SECONDARY}
					onClick={() => router.push("/shows")}
				>
					All Podcasts
				</Button>
			</div>
		</section>
	)
}

export default OverviewContent
