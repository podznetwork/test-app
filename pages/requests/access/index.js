import { H3, SectionHeading } from "@/components/common/Typography"
import { Wrapper } from "@/components/Layout"
import {
	addRequest,
	updateRequest,
	useRequest,
	useRequestMutator
} from "@/lib/app/request"
import { useCurrentUser, useUsers, userRoles } from "@/lib/app/user"
import Link from "next/link"
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

const status = (approvedStatus, requestId, ownerRequestMutator, user) => {
	return approvedStatus === "approved" ||
		approvedStatus === "paid" ||
		user?.access?.includes("owner") ? (
		<>
			{approvedStatus === "paid" || user?.access?.includes("owner") ? (
				<div
					className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
					role="alert"
				>
					You already have access to owner account.
				</div>
			) : (
				<>
					<div
						className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
						role="alert"
					>
						Your access has been approved.
						<br></br>
						<Link href={"/pricing"}>
							<a className="underline">
								<button
									type="button"
									className="px-4 py-2 mt-2 mb-2 mr-2 text-sm font-medium text-center text-white bg-green-700 rounded-full hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
								>
									Pay here
								</button>
							</a>
						</Link>{" "}
						to get full owner access.
					</div>
				</>
			)}
		</>
	) : (
		<div
			className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
			role="alert"
		>
			<span className="font-medium">Sent!</span> Your request has been
			sent to the admin for approval.
		</div>
	)
}
function AccessRequestsPage() {
	const { request: ownerRequest } = useRequest("owner")
	const { request: guestRequest } = useRequest("guest")
	const ownerRequestMutator = useRequestMutator("owner")
	const guestRequestMutator = useRequestMutator("guest")
	const { user } = useCurrentUser()

	const [showOwnerForm, setShowOwnerForm] = useState(true)
	const [showGuestForm, setShowGuestForm] = useState(false)

	return (
		<Wrapper>
			<SectionHeading>Add your Podz</SectionHeading>
			{showOwnerForm && <AddPodcastView ownerRequest={ownerRequest} />}
		</Wrapper>
	)
}

export function AddPodcastView({ ownerRequest }) {
	const ownerRequestMutator = useRequestMutator("owner")
	const getGenreOptions = () => {
		return genreList.map(genre => ({
			label: genre,
			value: genre
		}))
	}

	const { users } = useUsers("user")
	const router = useRouter()

	const getHostUsersOptions = () => {
		const hosts = users?.filter(user => user.becomeHost)
		const options = hosts?.map(host => ({
			value: host._id,
			label: host.name
		}))
		return options
	}

	const [selectedHostOptions, setSelectedHostOptions] = useState(
		ownerRequest
			? ownerRequest?.allHosts?.map(host => ({
					value: host._id,
					label: host.name
			  }))
			: []
	)
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

	useEffect(() => {
		if (ownerRequest) {
			setSelectedHostOptions(
				ownerRequest?.allHosts?.map(host => ({
					value: host._id,
					label: host.name
				}))
			)
		}
	}, [ownerRequest])

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
			role: "owner"
		}

		try {
			if (!ownerRequest) {
				const requestId = await addRequest(newPodcast)
				ownerRequestMutator.addRequest({
					_id: requestId,
					...newPodcast,
					status: "pending"
				})
				router.replace("/podcast-requests")
				toast.success("Request has been sent to admin.")
			} else {
				await updateRequest(ownerRequest._id, newPodcast)
				ownerRequestMutator.updateRequest({
					_id: ownerRequest._id,
					...newPodcast
				})
				router.replace("/pricing-plans")
			}
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
		<div>
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
			<Button
				onClick={onSubmit}
				className="w-full md:w-auto"
				variant={buttonVariants.PRIMARY}
			>
				{ownerRequest ? "Edit Request" : "Request access to add PODZ"}
			</Button>
		</div>
	)
}

AccessRequestsPage.routeProtector = [userRoles.USER]

export default AccessRequestsPage
