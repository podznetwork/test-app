import Link from "next/link"
import Spinner from "../common/Spinner"
import { isUser } from "@/lib/app/user"
import Image from "next/image"
import { useRouter } from "next/router"
function Items({ podcast }) {
	const allHosts = [...podcast.hostUsers]
	for (let i = 0; i < podcast.hosts.length; i++) {
		if (!podcast.hosts[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
			allHosts.push(podcast.hosts[i])
		}
	}

	podcast.allHosts = allHosts

	const router = useRouter()

	return (
		<div className="w-full p-6 shrink-0 md:w-2/4 lg:w-1/3 md:first:pl-0 first:pt-0 md:pt-0">
			<figure className="relative max-w-sm p-2 transition-all duration-300 rounded-[14px] border border-[#f2f2f2] cursor-pointer filter bg-white">
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
										podcast.allHosts.length <= 1
											? "ml-2"
											: ""
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
const Content = ({ podcasts, className, loading }) => {
	return loading ? (
		<Spinner />
	) : (
		<section>
			{podcasts != undefined && podcasts?.length > 0 ? (
				<div
					className={
						className ??
						"flex flex-wrap justify-center w-full mt-6 md:justify-start md:flex-nowrap md:overflow-x-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-white"
					}
				>
					{podcasts?.map(podcast => (
						<Items key={podcast._id} podcast={podcast} />
					))}
				</div>
			) : (
				<div className="mt-10 mb-12">No Podcasts to show</div>
			)}
		</section>
	)
}

export default Content
