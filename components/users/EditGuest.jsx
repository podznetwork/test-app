import {
	addRequestByAdmin,
	updateRequest,
	updateUserRequest,
	useRequest,
	useUserRequest
} from "@/lib/app/request"
import { useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import Image from "next/image"
import { SectionHeading } from "../common/Typography"
import { Input, Textarea } from "../common/Input"
import { editUserData, useUser } from "@/lib/app/user"
import { useSWRConfig } from "swr"

function EditGuest({ userId, setSelectedUser, setShowModal }) {
	const { user } = useUser(userId)
	const { request } = useUserRequest(userId, "guest")
	const biographyRef = useRef()
	const experienceRef = useRef()
	const podcastLink = useRef()
	const nameRef = useRef()
	const emailRef = useRef()
	const { mutate } = useSWRConfig()

	const onSubmit = async () => {
		if (
			biographyRef.current.value === "" ||
			experienceRef.current.value === ""
		) {
			toast.error(
				"Make sure all the mandatory fields are filled before submitting the form."
			)
			return
		}

		try {
			updateRequest
			const requestId = await updateUserRequest(request?._id, {
				biography: biographyRef.current.value,
				experience: experienceRef.current.value,
				podcastLink: podcastLink.current.value
			})
			await editUserData(user._id, {
				name: nameRef.current.value,
				email: emailRef.current.value
			})
			mutate(`/api/requests/user?userId=${user._id}&role=guest`)
			setSelectedUser(null)
			setShowModal(false)
			toast.success("Guest updated successfully.")
		} catch (e) {
			console.log(e)
			toast.error(e.message)
		}
	}

	useEffect(() => {
		if (user) {
			nameRef.current.value = user.name
			emailRef.current.value = user.email
		}

		if (request) {
			biographyRef.current.value = request.biography
			experienceRef.current.value = request.experience
			podcastLink.current.value = request.podcastLink
		}
	}, [request, user])

	return (
		<div className="flex flex-col w-full gap-5">
			<div className="flex flex-row w-full gap-x-2">
				<button
					onClick={() => setShowModal(false)}
					className="flex items-center shrink-0"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading>Edit {user?.name}'s profile</SectionHeading>
			</div>
			<form className="flex flex-col gap-5">
				<Input label="Role" value={user?.role} disabled />
				<Textarea
					label="Biography"
					ref={biographyRef}
					type="text"
					placeholder="Your personal biography"
					reqired
				/>
				<Textarea
					label="Previous Experience"
					ref={experienceRef}
					type="text"
					placeholder="Your podcast experience"
					required
				/>
				<Input
					label="Podcast Episode Link"
					htmlType="text"
					ref={podcastLink}
					placeholder="https://abc.com/podcast/123"
					required
				/>
				<Input
					label="Name"
					htmlType="text"
					ref={nameRef}
					placeholder="Bonnie Green"
					required
				/>
				<Input
					label="Email"
					htmlType="text"
					ref={emailRef}
					placeholder="emample@email.com"
					required
				/>
			</form>
			<div className="flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
				<Button
					type="button"
					onClick={onSubmit}
					variant={buttonVariants.PRIMARY}
					className="w-full lg:max-w-[240px]"
				>
					Save Changes
				</Button>
			</div>
		</div>
	)
}

export default EditGuest
