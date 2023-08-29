import {
	addRequest,
	addRequestByAdmin,
	updateRequest,
	useRequestMutator
} from "@/lib/app/request"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Input } from "@/components/common/Input"
import { genreList } from "@/lib/app/episode"
import {
	CreatableSelectInput,
	SelectInput
} from "@/components/common/Input/SelectInput"
import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
import { toast } from "react-hot-toast"
import { useRouter } from "next/router"
import Image from "next/image"
import { useUsers } from "@/lib/app/user"

export const frequencyOptions = [
	{ label: "Episodic", value: "episodic", isDisabled: true },
	{ label: "Daily", value: "daily" },
	{ label: "Weekly", value: "weekly" },
	{ label: "Bi-Weekly", value: "bi-weekly" },
	{ label: "Monthly", value: "monthly" },
	{ label: "Serial Frequency", value: "monthly", isDisabled: true },
	{ label: "Serial", value: "serial" }
]

export const viewsOptions = [
	{ label: "<1000", value: "<1000" },
	{ label: "1000-2000", value: "1000-2000" },
	{ label: "2000-3000", value: "2000-3000" },
	{ label: "3000+", value: "3000+" }
]

function AdminOwnerRequest({
	ownerRequest,
	userId,
	setSelectedOwnerUser,
	setShowOwnerForm
}) {
	const getGenreOptions = () => {
		return genreList.map(genre => ({
			label: genre,
			value: genre
		}))
	}
	const { users } = useUsers("user")

	const [selectedHostOptions, setSelectedHostOptions] = useState([])
	const [genre, setGenre] = useState([])
	const [hosts, setHosts] = useState([])
	const [views, setViews] = useState(null)
	const [frequency, setFrequency] = useState(null)
	const [startDate, setStartDate] = useState(new Date())
	const podcastNameRef = useRef()
	const podcastDescriptionRef = useRef()
	const websiteUrlRef = useRef()
	const youtubeURLRef = useRef()
	const rssLinkRef = useRef()

	const getHostUsersOptions = () => {
		const hosts = users?.filter(user => user.becomeHost)
		const options = hosts?.map(host => ({
			value: host._id,
			label: host.name
		}))
		return options
	}

	const onSubmit = async () => {
		if (
			genre.length <= 0 ||
			hosts.length <= 0 ||
			!views ||
			!frequency ||
			podcastNameRef.current.value === "" ||
			podcastDescriptionRef.current.value === ""
		) {
			toast.error(
				"Make sure all the mandatory fields are filled before submitting the form."
			)
			return
		}

		const newPodcast = {
			_id: userId,
			podcastName: podcastNameRef.current.value,
			podcastDescription: podcastDescriptionRef.current.value,
			genre,
			hosts,
			views,
			frequency,
			startDate: new Date(startDate),
			websiteUrl: websiteUrlRef.current.value,
			youtubeURL: youtubeURLRef.current.value,
			rssLink: rssLinkRef.current.value,
			role: "owner",
			status: "approved",
			adminAdded: true
		}

		try {
			// if (!ownerRequest) {
			const requestId = await addRequestByAdmin(newPodcast)
			// ownerRequestMutator.addRequest({
			// 	_id: requestId,
			// 	...newPodcast,
			// 	status: "pending"
			// })
			setSelectedOwnerUser(null)
			setShowOwnerForm(false)
			toast.success("Podcast added successfully.")
			// } else {
			// 	await updateRequest(ownerRequest._id, newPodcast)
			// 	ownerRequestMutator.updateRequest({
			// 		_id: ownerRequest._id,
			// 		...newPodcast
			// 	})
			// 	router.replace("/pricing-plans")
			// }
			// setShowModal(false)
		} catch (e) {
			toast.error(e.message)
		}
	}

	useEffect(() => {
		if (ownerRequest) {
			podcastNameRef.current.value = ownerRequest.podcastName
			podcastDescriptionRef.current.value =
				ownerRequest.podcastDescription
			youtubeURLRef.current.value = ownerRequest.youtubeURL
			setGenre(ownerRequest.genre)
			setHosts(ownerRequest.hosts)
			setFrequency(ownerRequest.frequency)
			setStartDate(new Date(ownerRequest.startDate))
			setViews(ownerRequest.views)
			websiteUrlRef.current.value = ownerRequest.websiteUrl
			rssLinkRef.current.value = ownerRequest.rssLink
		}
	}, [ownerRequest])

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-row w-full gap-x-2">
				<button
					onClick={() => {
						setShowOwnerForm(false)
						setSelectedOwnerUser(null)
					}}
					className="flex items-center shrink-0"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<div className="items-center lg:flex gap-y-4 lg:gap-x-3">
					<div
						className={`flex flex-col lg:flex-row lg:items-center gap-4`}
					>
						<div>
							<h2 className="text-lg font-medium md:text-[22px]">
								Fill podcast owner PODZ details
							</h2>
						</div>
					</div>
					<p className="text-sm text-primary">
						User will be required to pay from his side
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 my-4 md:grid-cols-2">
				<Input
					ref={podcastNameRef}
					className="col-span-1"
					label="Podcast Name"
					placeholder="Truth, Lies, Shenanigans"
				/>
				<Input
					ref={podcastDescriptionRef}
					className="col-span-1"
					label="Podcast Description"
					placeholder="Description text"
				/>
				<CreatableSelectInput
					options={getHostUsersOptions()}
					value={selectedHostOptions}
					onChange={options => {
						setHosts(
							options.map(option => ({
								_id: option.value
							}))
						)
						setSelectedHostOptions(options)
					}}
					isSearchable
					required
					multiSelect
					className="col-span-1"
					label="Hosts"
					placeholder="Start writing to select"
				/>
				<SelectInput
					value={frequencyOptions.find(fr => fr.value === frequency)}
					options={frequencyOptions}
					onChange={option => setFrequency(option.value)}
					isSearchable
					required
					className="col-span-1"
					label="Frequency of Episodes"
					placeholder="Select Option"
				/>
				<Input
					ref={youtubeURLRef}
					className="col-span-1"
					label="Youtube URL"
					placeholder="https://youtube.com"
				/>
				<SelectInput
					label="Genre"
					value={getGenreOptions().filter(g =>
						genre.includes(g.value)
					)}
					isSearchable
					required
					multiSelect
					onChange={options => {
						setGenre(options.map(option => option.value))
					}}
					placeholder="Start to write to select"
					options={getGenreOptions()}
				/>
				<SelectInput
					isSearchable
					required
					value={viewsOptions.filter(
						option => option.value === views
					)}
					options={viewsOptions}
					onChange={option => setViews(option.value)}
					className="col-span-1"
					label="Monthly Views/Downloads"
					placeholder="Select"
				/>
				<Input
					htmlType="date"
					value={startDate.toISOString().split("T")[0]}
					selected={startDate}
					onChange={e => setStartDate(new Date(e.target.value))}
					className="col-span-1"
					label="Start Date"
					placeholder="10/03/2023"
				/>
				<Input
					ref={websiteUrlRef}
					className="col-span-1"
					label="Website URL"
					placeholder="https://abc.com"
				/>
				<Input
					ref={rssLinkRef}
					className="col-span-1"
					label="RSS Link"
					placeholder="abc/s/1222/podcast"
				/>
			</div>
			<div>
				<Button
					onClick={onSubmit}
					className="w-full md:w-auto md:min-w-[180px]"
					variant={buttonVariants.PRIMARY}
				>
					{ownerRequest ? "Edit Request" : "Save"}
				</Button>
			</div>
		</div>
	)
}

export default AdminOwnerRequest
