import {
	editUserData,
	unfollowPodcast,
	useCurrentUser,
	useUserMutator
} from "@/lib/app/user"
import Image from "next/image"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { Content } from "../content"
import CustomImage from "../CustomImage/CustomImage"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { SectionHeading } from "../common/Typography"
import { PodcastCardItem } from "../content/OverviewContent"
import { useFollowedPodcastsMutator } from "@/lib/app/podcast"
import { useSWRConfig } from "swr"
import { Input, Textarea } from "../common/Input"
import { CreatableSelectInput } from "../common/Input/SelectInput"
import SocialLogins from "./SocialLogins"
import { Modal } from "../common/Modal"
import { createConversation } from "@/lib/app/conversation"

function EditProfile({ setEditMode, user }) {
	const [profilePic, setProfilePic] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [nickname, setNickname] = useState(user?.nickname ?? "")
	const [bio, setBio] = useState(user?.bio ?? "")
	const [interests, setInterests] = useState(user?.interests ?? [])
	const userMutator = useUserMutator()

	const onSubmit = async e => {
		e.preventDefault()
		try {
			setIsLoading(true)
			const newUserData = {}
			if (profilePic) {
				const profilePicData = new FormData()
				profilePicData.append("file", profilePic)
				profilePicData.append(
					"upload_preset",
					process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
				)
				profilePicData.append(
					"cloud_name",
					process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD
				)

				const response = await fetch(
					`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
					{
						method: "post",
						body: profilePicData
					}
				)
				const data = await response.json()
				newUserData.profilePicture = data.url
			}
			if (nickname !== user.nickname) newUserData.nickname = nickname
			if (bio !== user.bio) newUserData.bio = bio
			if (interests !== user.interests) newUserData.interests = interests
			await editUserData(user._id, newUserData)
			userMutator.updateUser({ ...user, ...newUserData })
			setEditMode(false)
			toast.success("Profile updated successfully")
		} catch (e) {
			toast.error(e.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="pb-4">
			<div className="flex flex-col w-full gap-4 lg:w-1/2">
				<div className="relative">
					<p className="mb-2">Profile Picture</p>
					<label className="p-2 block w-28 text-sm flex items-center justify-center h-28 border rounded-[18px] border-dashed border-[#4B5563]">
						Upload your photo
						<input
							accept="image/*"
							type="file"
							onChange={e => setProfilePic(e.target.files[0])}
							className="hidden"
						/>
					</label>
					{user?.profilePicture && (
						<div className="absolute bottom-0 bg-white rounded-[18px] ">
							<input
								accept="image/*"
								type="file"
								onChange={e => setProfilePic(e.target.files[0])}
								className="absolute inset-0 z-10 w-full h-full border-gray-300 rounded-full opacity-0 cursor-pointer"
							/>
							<Image
								className="rounded-[18px]"
								src={user?.profilePicture}
								alt="Profile Picture"
								height={112}
								width={112}
							/>
						</div>
					)}
				</div>
				{profilePic && (
					<div className="flex justify-between text-sm truncate">
						<p>{profilePic.name}</p>
						<button onClick={() => setProfilePic(null)}>
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
				<Input
					value={nickname}
					onChange={e => setNickname(e.target.value)}
					label="Nickname"
					placeholder="Please enter your nickname"
				/>
				<Textarea
					value={bio}
					onChange={e => setBio(e.target.value)}
					label="Bio"
					placeholder="Please write a short bio about yourself"
				/>
				<CreatableSelectInput
					multiSelect={true}
					value={interests.map(value => ({ value, label: value }))}
					onChange={data =>
						setInterests(data.map(({ value }) => value))
					}
					label="Interests"
					placeholder="Please write your interests"
				/>
				<SocialLogins user={user} />
				<div className="mt-4 flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
					<Button
						variant={buttonVariants.PRIMARY}
						className="w-full lg:max-w-[150px]"
						loading={isLoading}
						onClick={onSubmit}
					>
						Save Changes
					</Button>
					<Button
						variant={buttonVariants.SECONDARY}
						className="w-full lg:max-w-[150px]"
						onClick={() => {
							setEditMode(false)
						}}
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	)
}

function HostProfile({
	user,
	editable,
	userMutator,
	podcasts,
	ownerPodcasts,
	episodes,
	favoritePodcasts
}) {
	const messageRef = useRef()
	const { user: currentUser } = useCurrentUser()
	const [showModal, setShowModal] = useState(false)
	const [showMessageModal, setShowMessageModal] = useState(false)
	const followedPodcastMutator = useFollowedPodcastsMutator()
	const { mutate } = useSWRConfig()
	const [editMode, setEditMode] = useState(false)
	const confirmedPodcasts = podcasts?.filter(
		podcast => podcast.hosts.confirmed
	)
	const [loading, setLoading] = useState(false)
	const sendMessage = async e => {
		e.preventDefault()
		try {
			setLoading(true)
			const conversation = await createConversation({
				receiverId: user._id,
				message: messageRef.current.value
			})
			mutate("/api/conversations")
			setLoading(false)
			setShowMessageModal(false)
		} catch (e) {
			setLoading(false)
		}
	}

	return (
		<>
			<div className="flex flex-col gap-y-5">
				{editable ? (
					<SectionHeading
						buttonOnClick={() => setEditMode(true)}
						button={editable ? (editMode ? null : "Edit") : null}
						button2={user?._id !== currentUser?._id && "Message"}
						button2OnClick={() => setShowMessageModal(true)}
					>
						My Profile
					</SectionHeading>
				) : (
					<SectionHeading
						button={user?._id !== currentUser?._id && "Message"}
						buttonOnClick={() => setShowMessageModal(true)}
					>
						Profile
					</SectionHeading>
				)}
				{showMessageModal && (
					<Modal onClose={() => setShowMessageModal(false)}>
						<div className="flex flex-col gap-5">
							<h3 className="text-lg font-[500px]">
								Send Message
							</h3>
							<Textarea
								ref={messageRef}
								placeholder="Text Message"
							/>
							<Button
								onClick={sendMessage}
								variant={buttonVariants.PRIMARY}
								className="mx-auto min-w-[180px]"
							>
								Send
							</Button>
						</div>
					</Modal>
				)}
				{editMode ? (
					<EditProfile user={user} setEditMode={setEditMode} />
				) : (
					<>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<div className="col-span-1 p-5 bg-white border border-[#f2f2f2] rounded-[14px] flex flex-col gap-y-4">
								<div className="flex flex-col items-center w-full">
									<div>
										<CustomImage
											alt="Profile Picture"
											src={
												user?.profilePicture ??
												"/images/default_user.jpg"
											}
											width={70}
											className="rounded-full"
										/>
										<div className="justify-center w-full mt-1 gap-x-1">
											<p className="text-center">
												{user?.name}
											</p>
										</div>
									</div>
									<div className="grow">
										<div className="grid justify-center grid-cols-2 gap-4 text-center md:flex ">
											{user?.access.map(
												(access, index) => (
													<div
														key={index}
														className="col-span-1 md:self-justify-center"
													>
														{
															<Image
																alt="access badge"
																src={
																	access ===
																	"owner"
																		? `/podcaster.JPG`
																		: `/${access}.JPG`
																}
																className="inline-block"
																width={70}
																height={70}
																key={index}
															/>
														}
													</div>
												)
											)}
										</div>
									</div>
								</div>
								<div className="flex flex-col gap-y-4">
									<h3 className="font-semibold text-center">
										Interests
									</h3>
									<div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
										{user?.interests?.map((interest, i) => (
											<div
												key={i}
												className="px-4 py-1 text-primary"
											>
												{interest}
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="col-span-1 py-5 px-3 bg-white border border-[#f2f2f2] rounded-[14px] flex flex-col gap-y-4">
								<div className="flex flex-col h-full gap-y-4">
									<h3 className="font-semibold text-center">
										About Me
									</h3>
									<p className="text-xs grow">{user?.bio}</p>
									<div className="flex justify-center gap-x-4">
										{user?.facebookProfile && (
											<a href={user?.facebookProfile}>
												<Image
													src="/images/facebook.svg"
													height={30}
													width={26}
													alt="Facebook Icon"
												/>
											</a>
										)}
										{user?.twitterProfile && (
											<a href={user?.twitterProfile}>
												<Image
													src="/images/twitter.svg"
													height={26}
													width={26}
													alt="Twitter Icon"
												/>
											</a>
										)}
										{user?.instagramProfile && (
											<a href={user?.instagramProfile}>
												<Image
													src="/images/instagram.svg"
													height={26}
													width={26}
													alt="Twitter Icon"
												/>
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
						{favoritePodcasts && user?.seeFavz && (
							<div className="flex flex-col gap-y-4">
								<SectionHeading>My FAVZ</SectionHeading>
								<div className="flex flex-wrap justify-center w-full mt-6 md:justify-start md:flex-nowrap md:overflow-x-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-white">
									{favoritePodcasts.map(podcast => (
										<PodcastCardItem
											editable={editable}
											key={podcast._id}
											podcast={podcast}
											handleUnfollow={async () => {
												try {
													await unfollowPodcast(
														podcast._id
													)
													followedPodcastMutator.unfollowPodcast(
														podcast._id
													)
													mutate(
														`/api/podcasts/${podcast._id}/follow`
													)
													toast.success(
														"Podcast unfollowed successfully."
													)
												} catch (e) {
													toast.error(e.message)
												}
											}}
										/>
									))}
								</div>
							</div>
						)}
						{user?.access.includes("owner") &&
							ownerPodcasts?.length > 0 && (
								<section className="mb-10 ">
									<SectionHeading>My PODZ</SectionHeading>
									<Content podcasts={ownerPodcasts} />
								</section>
							)}
						{user?.access.includes("host") &&
							podcasts?.length > 0 && (
								<section className="mb-10 ">
									<SectionHeading>
										My Hosted PODZ
									</SectionHeading>
									<Content podcasts={confirmedPodcasts} />
								</section>
							)}
					</>
				)}
			</div>

			{showModal && (
				<EditProfile
					userMutator={userMutator}
					user={user}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</>
	)
}

export default HostProfile
