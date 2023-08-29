import {
	followPodcast,
	unfollowPodcast,
	useFollowedPodcast,
	useFollowedPodcastMutator
} from "@/lib/app/user"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Spinner from "../common/Spinner"
import { Wrapper } from "../Layout"
import PodcastList from "./list"
import { Button, buttonVariants } from "../common/Button/Button"
import CustomImage from "../CustomImage/CustomImage"

function PodcastComponent({ podcast }) {
	const [podcastHosts, setPodcastHosts] = useState(null)
	const { data: session, status } = useSession()
	const router = useRouter()
	const { podcast: followedPodcast } = useFollowedPodcast(
		podcast._id,
		session?.user
	)
	const followedPodcastMutator = useFollowedPodcastMutator(podcast._id)

	const handleFollow = async () => {
		try {
			if (status === "authenticated") {
				await followPodcast(podcast._id)
				followedPodcastMutator.followPodcast(podcast)
				toast.success("Podcast followed successfully.")
			} else {
				router.replace("/login")
			}
		} catch (e) {
			toast.error(e.message)
		}
	}

	const handleUnfollow = async () => {
		try {
			await unfollowPodcast(podcast._id)
			followedPodcastMutator.unfollowPodcast()
			toast.success("Podcast unfollowed successfully.")
		} catch (e) {
			toast.error(e.message)
		}
	}

	useEffect(() => {
		if (podcast) {
			const allHosts = [...podcast.hostUsers]
			for (let i = 0; i < podcast.hosts.length; i++) {
				if (!podcast.hosts[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
					allHosts.push(podcast.hosts[i])
				}
			}
			setPodcastHosts(allHosts)
		}
	}, [podcast])

	return (
		<Wrapper className="p-5">
			{podcast && (
				<div>
					<section className="flex flex-col gap-5">
						{!podcast ? (
							<Spinner />
						) : (
							<>
								<div
									className={`w-full flex flex-col md:flex-row md:items-center grow gap-4`}
								>
									<div>
										<h2 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold">
											{podcast.name}
										</h2>
									</div>
									{followedPodcast?.podcast?._id ===
									podcast._id ? (
										<Button
											onClick={handleUnfollow}
											className="w-full md:w-auto min-w-[150px]"
											variant={buttonVariants.PRIMARY}
										>
											Unfollow
										</Button>
									) : (
										<Button
											onClick={handleFollow}
											className="w-full md:w-auto min-w-[150px]"
											variant={buttonVariants.PRIMARY}
										>
											Follow
										</Button>
									)}
								</div>
								<div className="flex flex-col sm:flex-row gap-[30px] p-5 bg-white border border-[#f2f2f2] rounded-[14px]">
									<div className="flex items-center justify-center grow">
										<CustomImage
											width={300}
											src={
												podcast.logoPath ??
												"/podcast.avif"
											}
											alt="mockup"
											className="justify-center max-w-[300px]"
										/>
									</div>
									<p className="text-lg">
										{podcast.description}
									</p>
								</div>
								<div className="flex flex-col p-5 bg-white border border-[#f2f2f2] rounded-[14px]">
									<h4 className="text-lg font-extrabold">
										Hosts
									</h4>
									<div className="flex flex-col sm:flex-row flex-wrap gap-[10px]">
										{podcastHosts?.map(host =>
											host._id?.match(
												/^[0-9a-fA-F]{24}$/
											) ? (
												<div
													key={host._id}
													className="flex flex-row items-center cursor-pointer sm:text-center sm:flex-col gap-x-2"
												>
													<Link
														href={`/profile/${host._id}`}
														passHref
													>
														<img
															className="w-12 h-12 mt-3 mb-3 rounded-full sm:mx-auto"
															src={
																host.profilePicture ??
																"/images/default_user.jpg"
															}
															alt="Rounded avatar"
														/>
													</Link>
													<p className="text-lg">
														<Link
															href={`/profile/${host._id}`}
														>
															{host.name}
														</Link>{" "}
													</p>
												</div>
											) : (
												<div
													key={host._id}
													className="flex flex-row items-center cursor-default sm:text-center sm:flex-col gap-x-2"
												>
													<img
														className="w-12 h-12 mt-3 mb-3 rounded-full sm:mx-auto"
														src={
															"/images/default_user.jpg"
														}
														alt="Rounded avatar"
													/>
													<p className="text-lg">
														{host.name}
													</p>
												</div>
											)
										)}
									</div>
								</div>
							</>
						)}
					</section>
					<section>
						<PodcastList podcastId={podcast._id} />
					</section>
				</div>
			)}
		</Wrapper>
	)
}

export default PodcastComponent
