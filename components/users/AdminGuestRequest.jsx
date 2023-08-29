import { addRequestByAdmin, useRequest } from "@/lib/app/request"
import { useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import Image from "next/image"
import { SectionHeading } from "../common/Typography"
import { Input, Textarea } from "../common/Input"

function AdminGuestRequest({ userId, setSelectedGuestUser, setShowModal }) {
	const { request } = useRequest("guest")
	const biographyRef = useRef()
	const experienceRef = useRef()
	const podcastLink = useRef()

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

		const guestRequest = {
			_id: userId,
			biography: biographyRef.current.value,
			experience: experienceRef.current.value,
			podcastLink: podcastLink.current.value,
			role: "guest",
			status: "approved"
		}

		try {
			const requestId = await addRequestByAdmin(guestRequest)
			setSelectedGuestUser(null)
			setShowModal(false)
			toast.success("Guest added successfully.")
		} catch (e) {
			console.log(e)
			toast.error(e.message)
		}
	}

	useEffect(() => {
		if (request) {
			biographyRef.current.value = request.biography
			experienceRef.current.value = request.experience
			podcastLink.current.value = request.podcastLink
		}
	}, [request])

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
				<SectionHeading>Fill guest profile</SectionHeading>
			</div>
			<form className="flex flex-col gap-5">
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

export default AdminGuestRequest
