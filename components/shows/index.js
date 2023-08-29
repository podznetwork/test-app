import { useAllPodcasts } from "@/lib/app/podcast"
import { fuzzySearch } from "@/lib/app/utils"
import arraySort from "array-sort"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import { BsFilter, BsSearch } from "react-icons/bs"
import Spinner from "../common/Spinner"
import CustomImage from "../CustomImage/CustomImage"
import { Wrapper } from "../Layout"
function ListItems({ podcast }) {
	const router = useRouter()
	const allHosts = [...podcast.hostUsers]
	for (let i = 0; i < podcast.hosts.length; i++) {
		if (!podcast.hosts[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
			allHosts.push(podcast.hosts[i])
		}
	}
	podcast.allHosts = allHosts

	return (
		<div
			key={podcast._id}
			className="grid grid-cols-12 p-4 mb-4 border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 hover:cursor-pointer"
			onClick={() => {
				router.push(`/shows/${podcast.uId}`)
			}}
		>
			<div className="col-span-12 m-auto md:col-span-3">
				<CustomImage
					className="rounded w-13 h-13 "
					src={podcast ? podcast.logoPath : `/profile-picture-5.jpeg`}
					alt="Default avatar"
					width={250}
					// height={13}
				/>
			</div>
			<div className="col-span-12 mt-2 md:col-span-9 md:pl-8">
				<h1 className="mb-4 text-xl font-bold leading-none tracking-tight dark:text-white">
					{podcast.name}
				</h1>

				<p className="break-words">{podcast.description}</p>
				<h5 className="mt-3 text-lg font-bold dark:text-white">
					Hosts
				</h5>
				<div className="flex flex-wrap mt-3">
					{podcast?.allHosts.map((host, index) =>
						host._id ? (
							<Link href={`/profile/${host._id}`} key={host._id}>
								<a
									key={host._id}
									className="bg-primary-100 hover:bg-primary-200 text-primary-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 dark:hover:bg-primary-300"
								>
									{host.name}
								</a>
							</Link>
						) : (
							<a
								key={index}
								className="bg-primary-100 hover:bg-primary-200 text-primary-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 dark:hover:bg-primary-300"
							>
								{host.name}
							</a>
						)
					)}
				</div>
			</div>
		</div>
	)
}
function ShowsList() {
	const { podcasts } = useAllPodcasts()
	const [podcastNameFilter, setPodcastNameFilter] = useState("")
	const [showFilterMenu, setShowFilterMenu] = useState(false)
	const [filterLoading, setFilterLoading] = useState(false)
	const podcastNameRef = useRef()
	const options = {
		includeScore: false,
		threshold: 0.2,
		keys: ["name"]
	}

	const filteredPodcasts = fuzzySearch(podcasts, podcastNameFilter, options)

	return (
		<Wrapper>
			<div className="flex flex-col items-center justify-between mt-12 md:mt-20 md:flex-row gap-y-4">
				<div className="flex items-center justify-between w-full">
					<h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
						All Shows
					</h1>
					<div
						onClick={() => setShowFilterMenu(!showFilterMenu)}
						onMouseLeave={() => setShowFilterMenu(false)}
						className="relative ml-8"
					>
						<button className="md:hidden mb-2 h-[45px] px-4 border border-gray-300 rounded-md cursor-pointer hover:shadow-md">
							<BsFilter className="text-primary" />
						</button>
						{/* {showFilterMenu && (
							<div className="bg-white border border-gray-300 z-40 rounded-md shadow-lg absolute right-0 w-[150px]">
								<ul>
									<li
										onClick={() => {
											arraySort(
												filteredPodcasts,
												"latestEpisodeDate"
											)
											setShowFilterMenu(false)
										}}
										className="p-2 cursor-pointer hover:bg-primary hover:text-white"
									>
										Recent
									</li>
									<li
										onClick={() => {
											arraySort(filteredPodcasts, "name")
											setShowFilterMenu(false)
										}}
										className="p-2 cursor-pointer hover:bg-primary hover:text-white"
									>
										Alphabetically
									</li>
								</ul>
							</div>
						)} */}
					</div>
				</div>
				<div className="flex flex-col items-center w-full md:flex-row">
					<div className="flex items-center justify-end w-full">
						<input
							ref={podcastNameRef}
							value={podcastNameFilter}
							onChange={e => setPodcastNameFilter(e.target.value)}
							className="border w-full md:w-[350px] h-[45px] p-2 rounded-tl-md rounded-bl-md outline-0 mb-2"
							placeholder="Search Shows"
						/>
						<button className="h-[45px] px-4 bg-primary rounded-tr-md rounded-br-md cursor-default mb-2">
							<BsSearch className="text-white" />
						</button>
					</div>
					<div
						onClick={() => setShowFilterMenu(!showFilterMenu)}
						onMouseLeave={() => setShowFilterMenu(false)}
						className="relative hidden ml-8 md:block"
					>
						<button className="mb-2 h-[45px] px-4 border border-gray-300 rounded-md cursor-pointer hover:shadow-md">
							<BsFilter className="text-primary" />
						</button>
						{showFilterMenu && (
							<div className="bg-white border border-gray-300 z-40 rounded-md shadow-lg absolute right-0 w-[150px]">
								<ul>
									<li
										onClick={() => {
											arraySort(
												filteredPodcasts,
												"latestEpisodeDate"
											)
											setShowFilterMenu(false)
										}}
										className="p-2 cursor-pointer hover:bg-primary hover:text-white"
									>
										Recent
									</li>
									<li
										onClick={() => {
											arraySort(filteredPodcasts, "name")
											setShowFilterMenu(false)
										}}
										className="p-2 cursor-pointer hover:bg-primary hover:text-white"
									>
										Alphabetically
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
			<section className="mt-6 mb-10">
				{filterLoading ? (
					<Spinner />
				) : (
					filteredPodcasts?.map(podcast => (
						<ListItems key={podcast._id} podcast={podcast} />
					))
				)}
			</section>
		</Wrapper>
	)
}

export default ShowsList
