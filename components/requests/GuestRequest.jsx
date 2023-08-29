import {
	addRequest,
	updateRequest,
	useRequest,
	useRequestMutator
} from "@/lib/app/request"
import { useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { Button } from "../common/Button"
import { useRouter } from "next/router"
import { buttonVariants } from "../common/Button/Button"
import Image from "next/image"
import { SectionHeading } from "../common/Typography"
import { Input, Textarea } from "../common/Input"

function GuestRequest() {
	const router = useRouter()
	const { request } = useRequest("guest")
	const guestRequestMutator = useRequestMutator("guest")
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
			biography: biographyRef.current.value,
			experience: experienceRef.current.value,
			podcastLink: podcastLink.current.value,
			role: "guest",
			status: "pending"
		}

		try {
			if (request) {
				await updateRequest(request._id, guestRequest)
				guestRequestMutator.updateRequest(request._id, guestRequest)
				toast.success("Request has been updated.")
				router.replace("/mypodcasts")
			} else {
				const requestId = await addRequest(guestRequest)
				guestRequestMutator.addRequest({
					_id: requestId,
					...guestRequest
				})
				toast.success("Request has been sent to admin.")
				router.replace("/mypodcasts")
			}
		} catch (e) {
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
					onClick={() => router.push("/mypodcasts")}
					className="flex items-center shrink-0"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading>Join our guest network</SectionHeading>
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
					{request ? "Update Request" : "Join"}
				</Button>
				<Button
					type="button"
					onClick={() => router.back()}
					variant={buttonVariants.SECONDARY}
					className="w-full lg:max-w-[240px]"
				>
					Cancel
				</Button>
			</div>
		</div>
	)
}

export default GuestRequest
