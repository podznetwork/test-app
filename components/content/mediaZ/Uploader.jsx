import CustomImage from "@/components/CustomImage/CustomImage"
import { SectionHeading } from "@/components/common/Typography"
import { usePodcast } from "@/lib/app/podcast"
import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import ReactPlayer from "react-player"

function MediaModal({ onClose, url, type }) {
	return (
		<div
			className="hidden sm:flex overflow-x-hidden overflow-y-auto fixed left-0 right-0 inset-0 z-50 justify-center items-center h-modal sm:h-full flex bg-[rgba(117,117,117,0.5)]"
			id="add-user-modal"
			aria-modal="true"
			role="dialog"
		>
			<div className="flex items-center justify-center relative w-full h-full max-w-[350px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[750px] px-4 md:h-auto min-h-[500px] max-h-[500px] ">
				<div className="absolute w-full h-full">
					{type === "video" ? (
						<div className="relative pt-[56.25%]">
							<ReactPlayer
								className="absolute top-0 left-0"
								controls
								url={url}
								width="100%"
								height="100%"
							/>
						</div>
					) : (
						<Image src={url} alt="Image" layout="fill" />
					)}
				</div>

				<button
					type="button"
					className="absolute top-2 right-2 z-10 text-primary bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
					data-modal-toggle="add-user-modal"
					onClick={onClose}
				>
					<svg
						className="w-6 h-6"
						fill="#EF620C"
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
		</div>
	)
}

function Media() {
	const router = useRouter()
	const { podcast } = usePodcast(router.query.podcast)
	const [showModal, setShowModal] = useState(false)
	const [selectedImage, setSelectedImage] = useState(null)

	const onDrop = useCallback(acceptedFiles => {
		console.log(acceptedFiles)
		// Do something with the files
	}, [])

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
			"video/mp4": [],
			"video/mkv": [],
			"video/avi": [],
			"video/mov": []
		}
	})

	const contentzMedia = [
		// {
		// 	url: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		// 	type: "image"
		// },
		// {
		// 	url: "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
		// 	type: "image"
		// },
		// {
		// 	url: "https://media.istockphoto.com/id/1472033202/video/cherry-blossoms-in-full-bloom.mp4?s=mp4-640x640-is&k=20&c=toXrqoCQlevYhH-pCe_9UFIKUEIXz2jGfKEntv8hLI4=",
		// 	type: "video"
		// },
		// {
		// 	url: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		// 	type: "image"
		// },
		// {
		// 	url: "https://images.unsplash.com/photo-1584713503693-bb386ec95cf2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
		// 	type: "image"
		// },
		// {
		// 	url: "https://images.unsplash.com/photo-1683009686716-ac2096a5a73b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		// 	type: "image"
		// }
	]

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-row mt-5 gap-x-2">
				<button
					onClick={() => router.push("/mediaz")}
					className="flex items-baseline shrink-0 translate-y-[4px] md:translate-y-[6px] lg:translate-y-[8px]"
				>
					<Image
						className=""
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading button="Upload">{podcast?.name}</SectionHeading>
			</div>
			{showModal && (
				<MediaModal
					type={selectedImage.type}
					url={selectedImage.url}
					onClose={() => setShowModal(false)}
				/>
			)}
			{contentzMedia?.length > 0 ? (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
					{contentzMedia?.map((media, index) => (
						<div
							key={index}
							className="relative col-span-1"
							onClick={() => {
								setShowModal(true)
								setSelectedImage(media)
							}}
						>
							{media.type === "video" ? (
								<>
									<div className="absolute z-10 flex items-center justify-center w-full h-full bg-white/0">
										<Image
											src="/images/play.svg"
											width={30}
											height={30}
											alt="Play Button"
										/>
									</div>
									<video className="w-full h-full">
										<source src={media.url}></source>
									</video>
								</>
							) : (
								<CustomImage
									src={media.url}
									width={400}
									alt="Content Z media"
								/>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="bg-white p-[50px] rounded-[18px]">
					<p className="text-center font-[18px] mb-[50px]">
						Welcome to MediaZ! Here, you can upload images and
						videos to promote your podcast. Our team will use these
						uploads to create ads and content for social media
						promotion. Simply click 'Upload' to get
						started.Available formats: jpeg, png, mp4, mkv, avi,
						mov.
						<br /> Happy sharing!
					</p>
					<div
						className="min-h-[270px] border border-[#4B5563] border-dashed rounded-[18px] flex items-center justify-center"
						{...getRootProps()}
					>
						<input {...getInputProps()} />
						<p>
							<span className="hidden md:inline">
								Drag & drop images or video there or{" "}
							</span>
							<span className="border-b border-black cursor-pointer">
								Upload
							</span>
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default Media
