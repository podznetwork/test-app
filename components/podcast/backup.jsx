import { genreList } from "@/lib/app/episode"
import {
	addPodcast,
	deletePodcast,
	loadRssLink,
	updatePodcast,
	usePodcasts,
	usePodcastsMutator
} from "@/lib/app/podcast"
import { useCurrentUser, useUsers } from "@/lib/app/user"
import { valueChecker } from "@/lib/app/utils"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { BsX } from "react-icons/bs"
import Select from "react-select"
import CreatableSelect from "react-select/creatable"
import { LoadingDots } from "../common/LoadingDots"
import { DeleteConfirmationModal } from "../common/Modal"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import CustomImage from "../CustomImage/CustomImage"
import Image from "next/image"
import { SectionHeading } from "../common/Typography"
import PodcastListCard from "./PodcastListCard"
import { Input } from "../common/Input"
import { CreatableSelectInput, SelectInput } from "../common/Input/SelectInput"
import { frequencyOptions, viewsOptions } from "pages/requests/access"
import { useRouter } from "next/router"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
function AddItem(props) {
	const {
		loading,
		setLoading,
		showModal,
		setShowModal,
		podcastMutator,
		selectedPodcast,
		episodesMutator
	} = props
	const [customImage, setCustomImage] = useState(false)
	const [selectedGenre, setSelectedGenre] = useState(false)
	const [genreOption, setGenreOption] = useState(false)
	const [episodes, setEpisodes] = useState([])
	const [host, setHost] = useState(
		selectedPodcast ? [...selectedPodcast.hosts] : []
	)
	const [contentLoaded, setContentLoaded] = useState(false)
	const [selectedHostOptions, setSelectedHostOptions] = useState(
		selectedPodcast
			? selectedPodcast.allHosts.map(host => ({
					value: host._id,
					label: host.name
			  }))
			: []
	)
	const [imagePath, setImagePath] = useState("")
	const nameRef = useRef()
	const descriptionRef = useRef()
	const logoRef = useRef()
	const hostsRef = useRef()
	const genreRef = useRef()
	const rssLinkRef = useRef()
	const { users } = useUsers("user")
	const router = useRouter()

	const getGenreOptions = () => {
		return genreList.map(genre => ({
			label: genre,
			value: genre
		}))
	}

	const editPodcast = async (name, description, hosts, logoPath, genre) => {
		valueChecker(
			[name, description, hosts, logoPath, genre],
			[nameRef, descriptionRef, hostsRef, logoRef, genreRef],
			["Name", "Description", "Hosts", "Logo", "Genre"]
		)
		const updatedPodcast = await updatePodcast(selectedPodcast._id, {
			name: name,
			description: description,
			hosts: hosts,
			logoPath: logoPath,
			genre: genre
		})
		podcastMutator.updatePodcast({
			...updatedPodcast,
			hosts: hosts,
			hostUsers: getHostUsers()
		})
		toast.success("Podcast edited successfully.")
	}

	const addNewPodcast = async (
		name,
		description,
		hosts,
		logoPath,
		genre,
		episodes,
		rssLink
	) => {
		valueChecker(
			[rssLink, name, description, hosts, logoPath, genre],
			[rssLinkRef, nameRef, descriptionRef, hostsRef, logoRef, genreRef],
			["RSS Link", "Name", "Description", "Hosts", "Logo", "Genre"]
		)
		const { podcastId, savedEpisodes } = await addPodcast({
			name: name,
			description: description,
			hosts: hosts,
			logoPath: logoPath,
			genre: genre,
			episodes,
			rssLink
		})
		podcastMutator.addPodcast({
			_id: podcastId,
			featured: false,
			name: name,
			description: description,
			hosts: getNamedHosts(hosts),
			hostUsers: getHostUsers(),
			logoPath: logoPath,
			genre: genre
		})
		episodesMutator.addEpisodes(savedEpisodes)
		toast.success("Podcast added successfully.")
	}

	const parseRSS = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const feed = await loadRssLink({ url: rssLinkRef.current.value })
			setContentLoaded(true)
			setEpisodes(feed.items ?? [])
			nameRef.current.value = feed.title ?? ""
			descriptionRef.current.value = feed.description ?? ""
			const genre = feed?.itunes?.categories
				? feed?.itunes?.categories
				: ""
			setSelectedGenre(genre)
			setGenreOption(
				getGenreOptions().filter(item => {
					const lowerCaseGenre = genre.map(gen => gen.toLowerCase())
					return lowerCaseGenre.includes(item.value.toLowerCase())
				})
			)
			setImagePath(feed.image.url)
		} catch (e) {
			toast.error(e.message)
		}
		setLoading(false)
	}

	const getHostUsersOptions = () => {
		const hosts = users.filter(
			user => user.access.includes("host") && user.becomeHost
		)
		const options = hosts.map(host => ({
			value: host._id,
			label: host.name
		}))
		return options
	}

	const getNamedHosts = hosts => {
		const namedHosts = hosts.map(host => {
			if (!host._id.match(/^[0-9a-fA-F]{24}$/)) {
				return {
					_id: host._id,
					name: host._id,
					confirmed: false
				}
			} else {
				return host
			}
		})

		return namedHosts
	}

	const getHostUsers = () => {
		const hosts = []
		for (let i = 0; i < host.length; i++) {
			for (let j = 0; j < users.length; j++) {
				if (host[i]._id === users[j]._id) {
					hosts.push(users[j])
				}
			}
		}
		return hosts
	}

	const onSubmit = async e => {
		e.preventDefault()
		try {
			setLoading(true)
			//If the user wants to set a custom logo image
			if (customImage) {
				const logoData = new FormData()
				logoData.append("file", logoRef.current.files[0])
				logoData.append(
					"upload_preset",
					process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
				)
				logoData.append(
					"cloud_name",
					process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD
				)

				fetch(
					`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
					{
						method: "post",
						body: logoData
					}
				)
					.then(response => response.json())
					.then(async data => {
						//Edit Podcast
						if (selectedPodcast) {
							await editPodcast(
								nameRef.current.value,
								descriptionRef.current.value,
								host,
								data.url,
								selectedGenre
							)
						} else {
							//Add a new podcast
							await addNewPodcast(
								nameRef.current.value,
								descriptionRef.current.value,
								host,
								data.url,
								selectedGenre,
								rssLinkRef.current.value
							)
						}
					})
					.catch(err => {
						toast.error(err.message)
					})
			} else {
				//If the user is okay with image parsed from rss
				if (selectedPodcast) {
					await editPodcast(
						nameRef.current.value,
						descriptionRef.current.value,
						host,
						imagePath,
						selectedGenre
					)
				} else {
					await addNewPodcast(
						nameRef.current.value,
						descriptionRef.current.value,
						host,
						imagePath,
						selectedGenre,
						episodes,
						rssLinkRef.current.value
					)
				}
			}
			setLoading(false)
			setShowModal(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	useEffect(() => {
		if (selectedPodcast && nameRef.current) {
			nameRef.current.value = selectedPodcast.name
			descriptionRef.current.value = selectedPodcast.description
			setSelectedGenre(selectedPodcast.genre)
			setGenreOption(
				getGenreOptions().filter(item => {
					const lowerCaseGenre = selectedPodcast.genre.map(gen =>
						gen.toLowerCase()
					)
					return lowerCaseGenre.includes(item.value.toLowerCase())
				})
			)
			rssLinkRef.current.value = selectedPodcast.rssLink
			setImagePath(selectedPodcast.logoPath)
		}
	}, [selectedPodcast])

	return (
		// <div
		// 	className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center h-modal sm:h-full flex bg-black/[0.5]"
		// 	id="add-user-modal"
		// 	aria-modal="true"
		// 	role="dialog"
		// >
		// 	<div className="relative w-full h-full max-w-2xl px-4 md:h-auto">
		// 		<div className="relative bg-white rounded-lg shadow">
		// 			<div className="flex items-start justify-between p-5 border-b rounded-t">
		// 				<h3 className="text-xl font-semibold">
		// 					Add new podcast page
		// 				</h3>
		// 				<button
		// 					type="button"
		// 					className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
		// 					data-modal-toggle="add-user-modal"
		// 					onClick={() => setShowModal(false)}
		// 				>
		// 					<svg
		// 						className="w-5 h-5"
		// 						fill="currentColor"
		// 						viewBox="0 0 20 20"
		// 						xmlns="http://www.w3.org/2000/svg"
		// 					>
		// 						<path
		// 							fillRule="evenodd"
		// 							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
		// 							clipRule="evenodd"
		// 						></path>
		// 					</svg>
		// 				</button>
		// 			</div>

		// 			<div className="p-6 space-y-6">
		// 				<form>
		// 					<div className="grid grid-cols-6 gap-6">
		// 						<div className="col-span-6 sm:col-span-4">
		// 							<label
		// 								htmlFor="first-name"
		// 								className="block mb-2 text-sm font-medium text-gray-900"
		// 							>
		// 								RSS Link
		// 							</label>
		// 							<input
		// 								ref={rssLinkRef}
		// 								type="text"
		// 								className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
		// 								placeholder="https://www.podz.com"
		// 								required=""
		// 							/>
		// 						</div>
		// 						<div className="col-span-6 text-right sm:col-span-2">
		// 							<label
		// 								htmlFor="first-name"
		// 								className="block mb-2 text-sm font-medium text-gray-900"
		// 							>
		// 								&nbsp;
		// 							</label>
		// 							<button
		// 								onClick={parseRSS}
		// 								className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
		// 								type="submit"
		// 							>
		// 								{loading ? (
		// 									<LoadingDots />
		// 								) : (
		// 									"Load RSS Link"
		// 								)}
		// 							</button>
		// 						</div>
		// 						{(contentLoaded || selectedPodcast) && (
		// 							<>
		// 								<div className="col-span-6 sm:col-span-3">
		// 									<label
		// 										htmlFor="first-name"
		// 										className="text-sm font-medium text-gray-900 block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
		// 									>
		// 										Name
		// 									</label>
		// 									<input
		// 										ref={nameRef}
		// 										type="text"
		// 										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
		// 										placeholder="Bonnie"
		// 										required
		// 									/>
		// 								</div>
		// 								<div className="col-span-6 sm:col-span-3">
		// 									<label
		// 										htmlFor="last-name"
		// 										className="text-sm font-medium text-gray-900 block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
		// 									>
		// 										Description
		// 									</label>
		// 									<input
		// 										type="text"
		// 										ref={descriptionRef}
		// 										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
		// 										placeholder="Green"
		// 										required
		// 									/>
		// 								</div>
		// 								<div className="col-span-6 sm:col-span-3">
		// 									<label
		// 										required
		// 										htmlFor="email"
		// 										className="text-sm font-medium text-gray-900 block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
		// 									>
		// 										Hosts
		// 									</label>
		// 									{users && (
		// 										<CreatableSelect
		// 											required
		// 											ref={hostsRef}
		// 											value={selectedHostOptions}
		// 											isMulti
		// 											options={getHostUsersOptions()}
		// 											onChange={options => {
		// 												setHost(
		// 													options.map(
		// 														option => ({
		// 															_id: option.value
		// 														})
		// 													)
		// 												)
		// 												setSelectedHostOptions(
		// 													options
		// 												)
		// 											}}
		// 										/>
		// 									)}
		// 								</div>
		// 								<div className="col-span-6 row-span-2 sm:col-span-3">
		// 									<label
		// 										htmlFor="phone-number"
		// 										className="text-sm font-medium text-gray-900 block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
		// 									>
		// 										Logo
		// 									</label>
		// 									{customImage ? (
		// 										<input
		// 											ref={logoRef}
		// 											type="file"
		// 											accept="image/*"
		// 											className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
		// 											required
		// 										/>
		// 									) : (
		// 										<>
		// 											<button
		// 												onClick={() =>
		// 													setCustomImage(true)
		// 												}
		// 												className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm bg-gray-50 sm:text-sm focus:ring-primary-600 focus:border-primary-600"
		// 											>
		// 												Set Custom Image
		// 											</button>
		// 											{(imagePath ||
		// 												selectedPodcast?.logoPath) && (
		// 												<CustomImage
		// 													src={
		// 														imagePath === ""
		// 															? selectedPodcast.logoPath
		// 															: imagePath
		// 													}
		// 													alt="Podcast Logo"
		// 													className="max-w-[100px] max-h-[100px]"
		// 													height={100}
		// 													width={100}
		// 												/>
		// 											)}
		// 										</>
		// 									)}
		// 								</div>

		// 								<div className="col-span-6 sm:col-span-3">
		// 									<label
		// 										htmlFor="company"
		// 										className="text-sm font-medium text-gray-900 block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
		// 									>
		// 										Genre
		// 									</label>
		// 									{/* <input
		// 								ref={genreRef}
		// 								type="text"
		// 								className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
		// 								placeholder="News"
		// 								required
		// 							/> */}
		// 									<Select
		// 										ref={genreRef}
		// 										required
		// 										isMulti
		// 										placeholder="News"
		// 										options={getGenreOptions()}
		// 										value={genreOption}
		// 										onChange={options => {
		// 											setGenreOption(options)
		// 											setSelectedGenre(
		// 												options.map(
		// 													option =>
		// 														option.value
		// 												)
		// 											)
		// 										}}
		// 									/>
		// 								</div>
		// 								{episodes.length > 0 && (
		// 									<div className="col-span-6 max-h-[150px] overflow-auto">
		// 										<h2 className="text-lg font-semibold">
		// 											Episodes
		// 										</h2>
		// 										{episodes.map(
		// 											(episode, index) => (
		// 												<div
		// 													key={index}
		// 													className="grid grid-cols-6 gap-6"
		// 												>
		// 													<p className="px-4 col-span-5 bg-gray-100 truncate py-1 ... border-b border-[#000000]">
		// 														<span className="font-semibold">
		// 															{index +
		// 																1 +
		// 																": "}
		// 														</span>{" "}
		// 														{episode.title}
		// 													</p>
		// 													<p className="flex text-right text-red-500">
		// 														<span className="mx-auto">
		// 															<BsX
		// 																onClick={() => {
		// 																	const newEpisodes =
		// 																		episodes
		// 																	newEpisodes.splice(
		// 																		index,
		// 																		1
		// 																	)
		// 																	setEpisodes(
		// 																		[
		// 																			...newEpisodes
		// 																		]
		// 																	)
		// 																}}
		// 																className="mx-auto text-lg border rounded-lg shadow-sm cursor-pointer text-primary-700"
		// 															/>
		// 														</span>
		// 													</p>
		// 												</div>
		// 											)
		// 										)}
		// 									</div>
		// 								)}
		// 							</>
		// 						)}
		// 					</div>
		// 				</form>
		// 			</div>

		// 			<div className="grid p-6 border-t border-gray-200 rounded-b place-items-end">
		// 				<button
		// 					onClick={onSubmit}
		// 					className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
		// 					type="submit"
		// 				>
		// 					{loading ? <LoadingDots /> : "Save"}
		// 				</button>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>

		<>
			{selectedPodcast && (
				<div className="flex flex-row gap-x-2">
					<button
						onClick={() => router.push("/podcasts")}
						className="flex items-center"
					>
						<Image
							src="/images/backArrow.svg"
							height={20}
							width={20}
							alt="Go Back"
						/>
					</button>
					<SectionHeading>{selectedPodcast.name}</SectionHeading>
				</div>
			)}
			<div className="grid md:grid-cols-2 gird-cols-1 gap-y-5 gap-x-9">
				<Input
					label="Podcast Name"
					ref={nameRef}
					placeholder="Truth, Lies, Shenanigans"
				/>
				<SelectInput
					label="Genre"
					multiSelect={true}
					ref={genreRef}
					required
					placeholder="News"
					options={getGenreOptions()}
					value={genreOption}
					onChange={options => {
						setGenreOption(options)
						setSelectedGenre(options.map(option => option.value))
					}}
				/>
				<Input
					label="Podcast Description"
					ref={descriptionRef}
					placeholder="Description Text"
				/>
				<SelectInput
					required
					options={viewsOptions}
					label="Monthly Views/Downloads"
					placeholder="Select"
				/>
				{users && (
					<CreatableSelectInput
						label="Hosts"
						required
						ref={hostsRef}
						value={selectedHostOptions}
						multiSelect={true}
						options={getHostUsersOptions()}
						onChange={options => {
							setHost(
								options.map(option => ({
									_id: option.value
								}))
							)
							setSelectedHostOptions(options)
						}}
					/>
				)}
				<Input
					label="Start Date"
					placeholder="10/03/2023"
					htmlType="date"
				/>
				<SelectInput
					required
					options={frequencyOptions}
					label="Frequency of Episodes"
					placeholder="Select"
				/>
				<Input label="Website URL" placeholder="https://abc.com" />
				<Input label="Youtube URL" placeholder="https://youtube.com" />
				<Input
					label="RSS Link"
					placeholder="abc/s/1222/podcast"
					ref={rssLinkRef}
				/>
			</div>
			<div className="flex flex-col mt-10 md:flex-row gap-x-9 gap-y-[10px]">
				<Button
					variant={buttonVariants.PRIMARY}
					className="w-full lg:max-w-[240px]"
				>
					Save Changes
				</Button>
				<Button
					variant={buttonVariants.SECONDARY}
					className="w-full lg:max-w-[240px]"
				>
					Cancel
				</Button>
			</div>
		</>
	)
}

function PodcastsTable({ episodesMutator }) {
	const [loading, setLoading] = useState(false)
	const [showModal, setShowModal] = useState(true)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const [selectedPodcastForEdit, setSelectedPodcastForEdit] = useState(null)
	const [selectedPodcastForDeletion, setSelectedPodcastForDeletion] =
		useState(null)
	const { podcasts, loading: podcastsLoading } = usePodcasts()
	const { user } = useCurrentUser()

	podcasts?.forEach(podcast => {
		const allHosts = [...podcast.hostUsers]
		for (let i = 0; i < podcast.hosts.length; i++) {
			if (!podcast.hosts[i]?._id?.match(/^[0-9a-fA-F]{24}$/)) {
				allHosts.push(podcast.hosts[i])
			}
		}
		podcast.allHosts = allHosts
	})

	const editPodcast = podcast => {
		setSelectedPodcastForEdit(podcast)
		setShowModal(true)
	}
	const podcastMutator = usePodcastsMutator()

	const onDeleteClick = podcast => {
		setShowDeleteConfirmationModal(true)
		setSelectedPodcastForDeletion(podcast)
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await deletePodcast(selectedPodcastForDeletion._id)
			podcastMutator.deletePodcast(selectedPodcastForDeletion._id)
			episodesMutator.deleteAllEpisodes(selectedPodcastForDeletion._id)
			toast.success("Podcast deleted successfully.")
			setShowDeleteConfirmationModal(false)
			setLoading(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}
	return (
		<section>
			<div className="grid grid-cols-2 pb-5">
				{/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Podcasts
				</h5> */}
				{showDeleteConfirmationModal && (
					<DeleteConfirmationModal
						heading="Delete Podcast"
						message="Are you sure that you want to delete this podcast?"
						onClose={() => setShowDeleteConfirmationModal(false)}
						onConfirm={onDelete}
						loading={loading}
					/>
				)}
				{/* <div className="flex justify-end">
					<button
						type="button"
						className="text-white  bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
						onClick={() => {
							if (
								podcasts?.length >=
								(user?.plan?.numberOfPodcasts ?? 1)
							) {
								toast.error(
									`You cannot add more than ${
										user?.plan?.numberOfPodcasts ?? 1
									} podcasts with your current pricing plan.`
								)
								return
							}
							setSelectedPodcastForEdit(null)
							setShowModal(true)
						}}
					>
						Add new Podcast Page
					</button>
				</div> */}
			</div>
			<section>
				{podcastsLoading ? (
					<Spinner />
				) : showModal ? (
					<AddItem
						loading={loading}
						setLoading={setLoading}
						episodesMutator={episodesMutator}
						selectedPodcast={selectedPodcastForEdit}
						showModal={showModal}
						setShowModal={setShowModal}
						podcastMutator={podcastMutator}
					/>
				) : (
					<>
						<SectionHeading>My PODZ</SectionHeading>
						<Table
							className="hidden lg:block"
							heading="Podcasts"
							headers={["name", "description", "genre"]}
							fields={["name", "description", "genre"]}
							buttons={[
								{
									icon: (
										<Image
											src="/images/edit.svg"
											height={16}
											width={16}
											alt="Edit Episode"
										/>
									)
								},
								{
									icon: (
										<Image
											src="/images/delete.svg"
											height={16}
											width={16}
											alt="Edit Episode"
										/>
									)
								}
							]}
							link={true}
							// buttons={["Edit", "Delete"]}
							// buttonFunctions={[editPodcast, onDeleteClick]}
							data={podcasts}
						/>
						<div className="flex flex-col lg:hidden gap-y-4">
							{podcasts.map(podcast => (
								<PodcastListCard
									key={podcast._id}
									podcast={podcast}
								/>
							))}
						</div>
					</>
				)}
				<div></div>
			</section>
		</section>
	)
}

export default PodcastsTable
