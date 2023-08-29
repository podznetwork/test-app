import { Modal } from "../common/Modal"
import { SectionHeading } from "../common/Typography"
import { editUserData, useUser, useUserMutator } from "@/lib/app/user"
import { useState, useRef } from "react"
import { toast } from "react-hot-toast"
import { Input, Textarea } from "../common/Input"
import { CreatableSelectInput } from "../common/Input/SelectInput"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import Image from "next/image"

function AccountLinkModal({ type, setShowModal, user, userMutator }) {
	const accountRef = useRef()
	const onSubmit = async () => {
		try {
			switch (type) {
				case "Facebook": {
					await editUserData(user._id, {
						facebookProfile: accountRef.current.value
					})
					userMutator.updateUser({
						...user,
						facebookProfile: accountRef.current.value
					})
					break
				}

				case "Twitter": {
					await editUserData(user._id, {
						twitterProfile: accountRef.current.value
					})
					userMutator.updateUser({
						...user,
						twitterProfile: accountRef.current.value
					})
					break
				}

				case "Instagram": {
					await editUserData(user._id, {
						instagramProfile: accountRef.current.value
					})
					userMutator.updateUser({
						...user,
						instagramProfile: accountRef.current.value
					})
					break
				}
			}
			setShowModal(false)
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<Modal onClose={() => setShowModal(false)}>
			<div className="flex flex-col gap-5">
				<h3 className="text-lg font-[500px]">{type} Account Link</h3>
				<Input ref={accountRef} placeholder="URL" />
				<Button
					onClick={onSubmit}
					variant={buttonVariants.PRIMARY}
					className="mx-auto min-w-[180px]"
				>
					Save
				</Button>
			</div>
		</Modal>
	)
}

function FillOwnerInfo({ setEditMode, userId, setShowOwnerForm }) {
	const [profilePic, setProfilePic] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [nickname, setNickname] = useState(user?.nickname ?? "")
	const [bio, setBio] = useState(user?.bio ?? "")
	const [interests, setInterests] = useState(user?.interests ?? [])
	const [type, setType] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const { user } = useUser(userId)
	const userMutator = useUserMutator(userId)

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
			// setEditMode(false)
			setShowOwnerForm(true)
			toast.success("Profile updated successfully")
		} catch (e) {
			toast.error(e.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="pb-4">
			<div className="flex flex-col w-full gap-5 lg:w-1/2">
				<div className="flex flex-row w-full gap-x-2">
					<button
						onClick={() => setEditMode(false)}
						className="flex items-center shrink-0"
					>
						<Image
							src="/images/backArrow.svg"
							height={20}
							width={20}
							alt="Go Back"
						/>
					</button>
					<SectionHeading>Fill podcast owner profile</SectionHeading>
				</div>
				{showModal && (
					<AccountLinkModal
						setShowModal={setShowModal}
						type={type}
						user={user}
						userMutator={userMutator}
					/>
				)}
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
				<div className="flex flex-col gap-y-4">
					<h4 className="text-xs">Social Networks</h4>
					<div className="text-[#4B5563] flex gap-x-2">
						<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
							<Image
								width={24}
								height={24}
								type="button"
								src="/images/facebook.svg"
								alt="Twitter connect icon"
							/>
							<p className="text-xs">Facebook</p>
						</div>
						<div className="text-black grow">
							<Button
								className="relative w-full h-full"
								variant={buttonVariants.SECONDARY}
								onClick={async () => {
									if (user?.facebookProfile) {
										try {
											await editUserData(user._id, {
												facebookProfile: null
											})
											userMutator.updateUser({
												...user,
												facebookProfile: null
											})
										} catch (e) {
											console.log(e)
										}
									} else {
										setType("Facebook")
										setShowModal(true)
									}
								}}
							>
								{user?.facebookProfile ? (
									<>Disconnect</>
								) : (
									<>Connect</>
								)}
							</Button>
						</div>
					</div>
					<div className="text-[#4B5563] flex gap-x-2">
						<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
							<Image
								width={24}
								height={24}
								type="button"
								src="/images/twitter.svg"
								alt="Twitter connect icon"
							/>
							<p className="text-xs">Twitter</p>
						</div>
						<div className="text-black grow">
							{user?.twitterProfile ? (
								<Button
									onClick={async () => {
										try {
											await editUserData(user._id, {
												twitterProfile: null
											})
											userMutator.updateUser({
												...user,
												twitterProfile: null
											})
										} catch (e) {
											console.log(e)
										}
									}}
									variant={buttonVariants.SECONDARY}
									className="relative w-full h-full"
								>
									Disconnect
								</Button>
							) : (
								<Button
									onClick={() => {
										setType("Twitter")
										setShowModal(true)
									}}
									className="relative w-full h-full"
									variant={buttonVariants.SECONDARY}
								>
									Connect
								</Button>
							)}
						</div>
					</div>
					<div className="text-[#4B5563] flex gap-x-2">
						<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
							<Image
								width={24}
								height={24}
								type="button"
								src="/images/instagram.svg"
								alt="Twitter connect icon"
							/>
							<p className="text-xs">Instagram</p>
						</div>
						<div className="text-black grow">
							{user?.instagramProfile ? (
								<Button
									onClick={async () => {
										try {
											await editUserData(user._id, {
												instagramProfile: null
											})
											userMutator.updateUser({
												...user,
												instagramProfile: null
											})
										} catch (e) {
											console.log(e)
										}
									}}
									variant={buttonVariants.SECONDARY}
									className="relative w-full h-full"
								>
									Disconnect
								</Button>
							) : (
								<Button
									onClick={() => {
										setType("Instagram")
										setShowModal(true)
									}}
									className="relative w-full h-full"
									variant={buttonVariants.SECONDARY}
								>
									Connect
								</Button>
							)}
						</div>
					</div>
					{/* <div className="text-[#4B5563] flex gap-x-2">
				<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
					<Image
						width={24}
						height={24}
						type="button"
						src="/images/instagram.svg"
						alt="Twitter connect icon"
					/>
					<p className="text-xs">Tiktok</p>
				</div>
				<div className="text-black grow">
					{user?.instagramProfile ? (
						<Button
							onClick={async () => {
								try {
									await editUserData(user._id, {
										instagramProfile: null
									})
									userMutator.updateUser({
										...user,
										instagramProfile: null
									})
								} catch (e) {
									console.log(e)
								}
							}}
							variant={buttonVariants.SECONDARY}
							className="relative w-full h-full"
						>
							Disconnect
						</Button>
					) : (
						<a href={getTiktokOAuthUrl()}>
							<Button
								className="relative w-full h-full"
								variant={buttonVariants.SECONDARY}
							>
								Connect
							</Button>
						</a>
					)}
				</div>
			</div> */}
				</div>
				{/* <SocialLogins user={user} /> */}
				<div>
					<Button
						variant={buttonVariants.PRIMARY}
						className="w-full lg:w-auto lg:min-w-[180px]"
						loading={isLoading}
						onClick={onSubmit}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}

export default FillOwnerInfo
