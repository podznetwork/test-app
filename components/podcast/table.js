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
import { DeleteConfirmationModal, Modal } from "../common/Modal"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import Image from "next/image"
import { SectionHeading } from "../common/Typography"
import PodcastListCard from "./PodcastListCard"
import { Input, Textarea } from "../common/Input"
import { CreatableSelectInput, SelectInput } from "../common/Input/SelectInput"
import { useRouter } from "next/router"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { useRequest } from "@/lib/app/request"
function AddItem(props) {
	const {
		loading,
		setLoading,
		showModal,
		setShowModal,
		podcastMutator,
		selectedPodcast,
		setSelectedPodcast,
		episodesMutator,
		totalPodcasts
	} = props
	const { user } = useCurrentUser()
	const [customImage, setCustomImage] = useState(false)
	const [selectedGenre, setSelectedGenre] = useState(false)
	const [genreOption, setGenreOption] = useState(false)
	const [episodes, setEpisodes] = useState([])
	const [host, setHost] = useState(
		selectedPodcast ? [...selectedPodcast.hosts] : []
	)
	const [showPodcastError, setShowPodcastError] = useState(false)
	const [contentLoaded, setContentLoaded] = useState(false)
	const [selectedHostOptions, setSelectedHostOptions] = useState(
		selectedPodcast
			? selectedPodcast.allHosts.map(host => ({
					value: host._id,
					label: host.name
			  }))
			: []
	)
	const router = useRouter()
	const [imagePath, setImagePath] = useState("")
	const [rssLoading, setRssLoading] = useState(false)
	const [logo, setLogo] = useState(null)
	const nameRef = useRef()
	const descriptionRef = useRef()
	const logoRef = useRef()
	const hostsRef = useRef()
	const genreRef = useRef()
	const rssLinkRef = useRef()
	const { users } = useUsers("user")

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
			[name, rssLink, description, hosts, logoPath, genre],
			[nameRef, rssLinkRef, descriptionRef, hostsRef, logoRef, genreRef],
			["Name", "RSS Link", "Description", "Hosts", "Logo", "Genre"]
		)
		const { podcastId } = await addPodcast({
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
		toast.success("Podcast added successfully.")
	}

	const parseRSS = async e => {
		e.preventDefault()
		try {
			setRssLoading(true)
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
		} finally {
			setRssLoading(false)
		}
	}

	const getHostUsersOptions = () => {
		const hosts = users.filter(user => user.becomeHost)
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
				logoData.append("file", logo)
				logoData.append(
					"upload_preset",
					process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
				)
				logoData.append(
					"cloud_name",
					process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD
				)

				try {
					const response = await fetch(
						`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
						{
							method: "post",
							body: logoData
						}
					)
					const data = await response.json()
					if (selectedPodcast) {
						await editPodcast(
							nameRef.current.value,
							descriptionRef.current.value,
							host,
							data.url,
							selectedGenre
						)
					} else {
						if (user?.plan?.numberOfPodcasts < totalPodcasts) {
							setShowPodcastError(true)
						}
						//Add a new podcast
						await addNewPodcast(
							nameRef.current.value,
							descriptionRef.current.value,
							host,
							data.url,
							selectedGenre,
							episodes,
							rssLinkRef.current.value
						)
					}
				} catch (err) {
					console.log(err)
					toast.error(err.message)
				}
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
					if (user?.plan?.numberOfPodcasts < totalPodcasts) {
						setShowPodcastError(true)
					}
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
			router.replace(
				user?.access.includes("admin")
					? "/podz-management"
					: "/podcasts"
			)
			setShowModal(false)
		} catch (e) {
			console.log(e)
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

	useEffect(() => {
		if (user) {
			if (user?.plan?.numberOfPodcasts <= totalPodcasts) {
				setShowPodcastError(true)
			}
		}
	}, [user])

	return (
		<>
			{showPodcastError && !selectedPodcast && (
				<Modal onClose={() => router.replace("/mypodcasts")}>
					<div className="flex flex-col gap-5">
						<div className="text-center">
							Please upgrade your plan to be able to add more
							podcasts
						</div>
						<div className="flex flex-col items-center justify-center md:flex-row gap-7">
							<Button
								onClick={() => router.replace("/pricing-plans")}
								variant={buttonVariants.PRIMARY}
								className="w-full md:w-[180px]"
							>
								See Other Plans
							</Button>
							<Button
								onClick={() => {
									router.replace("/mypodcasts")
								}}
								variant={buttonVariants.SECONDARY}
								className="w-full md:w-[180px]"
							>
								Cancel
							</Button>
						</div>
					</div>
				</Modal>
			)}
			<div className="flex flex-row gap-x-2">
				<button
					onClick={() => {
						setSelectedPodcast(null)
						setShowModal(false)
					}}
					className="flex items-center"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading>
					{selectedPodcast ? selectedPodcast.name : "Add new PODZ"}
				</SectionHeading>
			</div>

			<div className="flex flex-col w-full gap-5 mt-6 lg:w-1/2">
				<div className="relative">
					<p className="mb-4 text-sm font-semibold">Logo</p>
					<label className="p-2 block w-28 text-sm flex items-center justify-center h-28 border rounded-[18px] border-dashed border-[#4B5563]">
						Upload your photo
						<input
							accept="image/*"
							onChange={e => {
								setCustomImage(true)
								setLogo(e.target.files[0])
							}}
							type="file"
							className="hidden"
						/>
					</label>
					{(selectedPodcast?.logoPath || imagePath) && (
						<div className="absolute bottom-0 bg-white rounded-[18px] ">
							<input
								accept="image/*"
								type="file"
								onChange={e => {
									setCustomImage(true)
									setLogo(e.target.files[0])
								}}
								className="absolute inset-0 z-10 w-full h-full border-gray-300 rounded-full opacity-0 cursor-pointer"
							/>
							<Image
								className="rounded-[18px]"
								src={selectedPodcast?.logoPath ?? imagePath}
								alt="Profile Picture"
								height={112}
								width={112}
							/>
						</div>
					)}
				</div>
				{logo && (
					<div className="flex justify-between text-sm truncate">
						<p>{logo.name}</p>
						<button onClick={() => setLogo(null)}>
							<svg
								className="w-3 h-3"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
					</div>
				)}
				<div className="flex flex-col gap-y-5">
					<div className="flex items-end gap-x-4">
						<Input
							ref={rssLinkRef}
							label="RSS Link"
							className="w-full"
							placeholder="abc/s/1222/podcast"
						/>
						<Button
							onClick={parseRSS}
							loading={rssLoading}
							className="basis-[200px] h-[50px]"
							variant={buttonVariants.SECONDARY}
						>
							Load RSS Link
						</Button>
					</div>
					<Input
						ref={nameRef}
						label="Podcast Name"
						className="w-full"
						placeholder="Sister Sesh Podcast"
					/>
					<Textarea
						ref={descriptionRef}
						label="Podcast Description"
						className="w-full"
						placeholder="Description Text"
					/>
					{users && (
						<CreatableSelectInput
							label="Hosts"
							required
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
					<SelectInput
						label="Genre"
						required
						multiSelect={true}
						options={getGenreOptions()}
						value={genreOption}
						onChange={options => {
							setGenreOption(options)
							setSelectedGenre(
								options.map(option => option.value)
							)
						}}
					/>
					{episodes?.length > 0 && (
						<div>
							<p className="mb-2 text-xs font-semibold">
								Episodes
							</p>
							<div className="flex flex-col gap-y-[10px] border border-primary bg-white rounded-[14px] px-[15px] py-[20px] text-black max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-white">
								{episodes.map((episode, index) => (
									<div
										key={episode._id ?? index}
										className="flex justify-between text-white bg-primary h-[50px] w-[300px] text-xs rounded-[18px] px-[10px] py-[5px] max-h-[25px]"
									>
										<p className="truncate max-w-[250px]">
											{episode.title}
										</p>
										<button
											onClick={() => {
												const newEpisodes = episodes
												newEpisodes.splice(index, 1)
												setEpisodes([...newEpisodes])
											}}
										>
											<svg
												className="w-3 h-3"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fillRule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clipRule="evenodd"
												></path>
											</svg>
										</button>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
						<Button
							onClick={onSubmit}
							loading={loading}
							variant={buttonVariants.PRIMARY}
							className="w-full lg:max-w-[240px]"
						>
							Save
						</Button>
						<Button
							onClick={() => {
								setSelectedPodcast(null)
								setShowModal(false)
							}}
							variant={buttonVariants.SECONDARY}
							className="w-full lg:max-w-[240px]"
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}

function PodcastsTable({ episodesMutator }) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const [selectedPodcastForEdit, setSelectedPodcastForEdit] = useState(null)
	const [selectedPodcastForDeletion, setSelectedPodcastForDeletion] =
		useState(null)
	const { podcasts, loading: podcastsLoading } = usePodcasts()
	const { user } = useCurrentUser()

	useEffect(() => {
		if (router.query.add) {
			setShowModal(true)
		}
	}, [router])

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
			// episodesMutator.deleteAllEpisodes(selectedPodcastForDeletion._id)
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
				{showDeleteConfirmationModal && (
					<DeleteConfirmationModal
						message={`Are you sure that you want to delete podcast ${selectedPodcastForDeletion?.name}`}
						onClose={() => setShowDeleteConfirmationModal(false)}
						onConfirm={onDelete}
						loading={loading}
					/>
				)}
			</div>
			<section className="flex flex-col gap-5">
				{podcastsLoading ? (
					<Spinner />
				) : showModal ? (
					<AddItem
						totalPodcasts={podcasts?.length}
						loading={loading}
						setLoading={setLoading}
						episodesMutator={episodesMutator}
						selectedPodcast={selectedPodcastForEdit}
						setSelectedPodcast={setSelectedPodcastForEdit}
						showModal={showModal}
						setShowModal={setShowModal}
						podcastMutator={podcastMutator}
					/>
				) : (
					<>
						{user?.access.includes("admin") ? (
							<SectionHeading>Podcasts</SectionHeading>
						) : (
							<SectionHeading>My PODZ</SectionHeading>
						)}

						{podcasts?.length > 0 ? (
							<>
								<Table
									className="hidden mt-6 lg:block"
									heading="Podcasts"
									headers={[
										"name",
										"description",
										"hosts",
										"genre"
									]}
									fields={[
										"name",
										"description",
										"allHosts",
										"genre"
									]}
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
									buttonFunctions={[
										editPodcast,
										onDeleteClick
									]}
									data={podcasts}
								/>
								<div className="flex flex-col lg:hidden gap-y-5">
									{podcasts.map(podcast => (
										<PodcastListCard
											link={true}
											key={podcast._id}
											podcast={podcast}
											editClick={() =>
												editPodcast(podcast)
											}
											deleteClick={() =>
												onDeleteClick(podcast)
											}
											showButtons
										/>
									))}
								</div>
							</>
						) : (
							<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
								{router.query.refresh
									? "Your podcast is being fetched. Please refresh in a while to see the changes."
									: "Currenly, there are no podcasts to show"}
							</div>
						)}
					</>
				)}
				<div></div>
			</section>
		</section>
	)
}

export default PodcastsTable
