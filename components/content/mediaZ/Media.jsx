import CustomImage from "@/components/CustomImage/CustomImage"
import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
import { DeleteConfirmationModal, Modal } from "@/components/common/Modal"
import { SectionHeading } from "@/components/common/Typography"
import { deleteMediaZ, useMediaZ, useMediaZMutator } from "@/lib/app/mediaz"
import { updatePodcast, usePodcast } from "@/lib/app/podcast"
import { useCurrentUser } from "@/lib/app/user"
import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import ReactPlayer from "react-player"
import { mutate, useSWRConfig } from "swr"
import MessageModal from "./MessageModal"
import { PlayAudio } from "../Recent"

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

function SaveStage({
	setShowMessageModal,
	setSelectedImages,
	podcast,
	selectedImages,
	setShowSaveStage,
	setShowUploadView
}) {
	const { mutate } = useSWRConfig()
	const router = useRouter()

	const removeImage = index => {
		const newImages = [...selectedImages]
		newImages.splice(index, 1)
		setSelectedImages(newImages)
	}

	const saveImages = async () => {
		try {
			const formData = new FormData()
			selectedImages.forEach((image, index) => {
				formData.append(`image${index + 1}`, image)
			})
			await fetch(`/api/mediaz?podcast=${podcast._id}`, {
				method: "POST",
				body: formData
			})
			mutate(`/api/mediaz?podcast=${podcast._id}`)
			setSelectedImages(null)
			setShowUploadView(false)
			setShowSaveStage(false)
			setShowMessageModal(true)
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-row mt-5 gap-x-2">
				<button
					onClick={() => router.back()}
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
				<SectionHeading>{podcast?.name}</SectionHeading>
			</div>
			<div className="bg-white rounded-[14px] px-5 py-3 border border-[#f2f2f2] flex flex-wrap justify-center w-full md:justify-start md:flex-nowrap md:overflow-x-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-white md:gap-x-[4%] lg:gap-x-[5%]">
				{selectedImages?.map((image, index) => (
					<div
						key={index}
						className="relative w-full h-full shrink-0 md:w-[48%] lg:w-[30%] md:first:pl-0 first:pt-0 md:pt-0 min-h-[200px] my-2"
					>
						<button
							onClick={() => removeImage(index)}
							className="absolute z-50 top-2 right-2"
						>
							<Image
								src="/images/trash.svg"
								height={30}
								width={30}
								alt="Delete Icon"
							/>
						</button>
						{image.type.split("/")[0] === "image" ? (
							<Image
								className="block px-2"
								alt="Image to be Saved"
								src={URL.createObjectURL(image)}
								layout="fill"
							/>
						) : (
							<>
								{image.type.split("/")[0] === "video" ? (
									<>
										<div className="absolute z-10 flex items-center justify-center w-full h-full bg-white/0">
											<Image
												src="/images/play.svg"
												width={30}
												height={30}
												alt="Play Button"
											/>
										</div>
										<video className="w-full h-full min-h-[200px]">
											<source
												src={URL.createObjectURL(image)}
											></source>
										</video>
									</>
								) : (
									<div>
										{PlayAudio(URL.createObjectURL(image))}
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>
			<div className="flex flex-col items-center justify-center gap-2 md:flex-row">
				<Button
					onClick={() => setShowSaveStage(false)}
					className="w-full md:w-40"
					variant={buttonVariants.SECONDARY}
				>
					Upload more
				</Button>
				<Button
					onClick={async () => await saveImages()}
					className="w-full md:w-40"
					variant={buttonVariants.PRIMARY}
				>
					Save
				</Button>
			</div>
		</div>
	)
}

function AddMediaModal({ setShowModal, loading, onSubmit }) {
	const onDrop = useCallback(acceptedFiles => {
		// setSelectedImages(prevImages => [...prevImages, ...acceptedFiles])
		// setShowSaveStage(true)
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

	return (
		<Modal onClose={() => setShowModal(false)}>
			<div className="flex flex-col gap-5">
				<h3 className="text-[18px] text-center">
					Add new featured podcast
				</h3>
				{/* <SelectInput
				onChange={option => setSelectedPodcast(option.value)}
				options={podcastOptions}
			/> */}
				<div className="flex flex-col items-center justify-center md:flex-row gap-7">
					<Button
						loading={loading}
						onClick={onSubmit}
						variant={buttonVariants.PRIMARY}
						className="w-full md:w-[180px]"
					>
						Upload
					</Button>
					<Button
						loading={loading}
						onClick={() => setShowModal(false)}
						variant={buttonVariants.SECONDARY}
						className="w-full md:w-[180px]"
					>
						Cancel
					</Button>
				</div>
			</div>
		</Modal>
	)
}

function Media() {
	const router = useRouter()
	const { podcast } = usePodcast(router.query.podcast)
	const [showMessageModal, setShowMessageModal] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [selectedImage, setSelectedImage] = useState(null)
	const [showSaveStage, setShowSaveStage] = useState(false)
	const [showAddModal, setShowAddModal] = useState(false)
	const [selectedImages, setSelectedImages] = useState([])
	const [selectedImageForDeletion, setSelectedImageForDeletion] =
		useState(null)
	const [showUploadView, setShowUploadView] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const { user } = useCurrentUser()
	const { mediaz: contentzMedia } = useMediaZ(router.query.podcast)
	const editRef = useRef()
	const deleteRef = useRef()
	const mediaZMutator = useMediaZMutator(router.query.podcast)

	const onDrop = useCallback(acceptedFiles => {
		setSelectedImages(prevImages => [...prevImages, ...acceptedFiles])
		setShowSaveStage(true)
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
			"video/mov": [],
			"audio/mpeg": [],
			"audio/vnd.wav": []
		}
	})

	useEffect(() => {
		async function changeNewStatus() {
			if (user) {
				if (user?.access?.includes("admin")) {
					await updatePodcast(router.query.podcast, {
						newMedia: false
					})
				}
			}
			mutate(`/api/podcasts`)
		}
		changeNewStatus()
	}, [user])

	return showSaveStage ? (
		<SaveStage
			setShowMessageModal={setShowMessageModal}
			setSelectedImages={setSelectedImages}
			setShowUploadView={setShowUploadView}
			selectedImages={selectedImages}
			setShowSaveStage={setShowSaveStage}
			podcast={podcast}
		/>
	) : (
		<div className="flex flex-col gap-5">
			<div className="flex flex-row mt-5 gap-x-2">
				<button
					onClick={() => router.back()}
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
				<SectionHeading
					buttonOnClick={() => setShowUploadView(true)}
					button="Upload"
				>
					{podcast?.name}
				</SectionHeading>
			</div>
			{showAddModal && <AddMediaModal />}
			{showModal && (
				<MediaModal
					type={selectedImage.type}
					url={`${process.env.NEXT_PUBLIC_S3_DOMAIN}/${selectedImage.s3path}`}
					onClose={() => setShowModal(false)}
				/>
			)}
			{showDeleteConfirmationModal && (
				<DeleteConfirmationModal
					onClose={() => setShowDeleteConfirmationModal(false)}
					message="Are you sure you want to delete image?"
					onConfirm={async () => {
						try {
							await deleteMediaZ(selectedImageForDeletion._id)
							mediaZMutator.deleteMedia(
								selectedImageForDeletion._id
							)
							setShowDeleteConfirmationModal(false)
						} catch (e) {
							console.log(e)
						}
					}}
				/>
			)}
			{showMessageModal && (
				<MessageModal setShowMessageModal={setShowMessageModal} />
			)}
			{contentzMedia?.length > 0 && !showUploadView ? (
				<div className="grid items-center grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
					{contentzMedia?.map((media, index) => (
						<div
							key={index}
							onMouseEnter={e => {
								const children = e.currentTarget.childNodes
								children[children.length - 1].classList.remove(
									"lg:opacity-0"
								)
								children[children.length - 2].classList.remove(
									"lg:opacity-0"
								)
								children[children.length - 1].classList.add(
									"lg:opacity-100"
								)
								children[children.length - 2].classList.add(
									"lg:opacity-100"
								)
							}}
							onMouseLeave={e => {
								const children = e.currentTarget.childNodes
								children[children.length - 1].classList.add(
									"lg:opacity-0"
								)
								children[children.length - 2].classList.add(
									"lg:opacity-0"
								)
								children[children.length - 1].classList.remove(
									"lg:opacity-100"
								)
								children[children.length - 2].classList.remove(
									"lg:opacity-100"
								)
							}}
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
										<source
											src={`${process.env.NEXT_PUBLIC_S3_DOMAIN}/${media.s3path}`}
										></source>
									</video>
								</>
							) : media.type === "image" ? (
								<CustomImage
									src={`${process.env.NEXT_PUBLIC_S3_DOMAIN}/${media.s3path}`}
									width={400}
									alt="Content Z media"
								/>
							) : (
								<div className="w-full px-2 py-10 bg-white">
									<audio
										className="w-full"
										controls
										src={`${process.env.NEXT_PUBLIC_S3_DOMAIN}/${media.s3path}`}
									>
										<a
											href={`${process.env.NEXT_PUBLIC_S3_DOMAIN}/${media.s3path}`}
										>
											Download audio
										</a>
									</audio>
								</div>
							)}
							{user?.access?.includes("admin") ? (
								<a
									ref={editRef}
									href={`${process.env.NEXT_PUBLIC_S3_DOMAIN}/${media.s3path}`}
									target="_blank"
									rel="noreferrer"
									className="absolute z-10 transition-opacity cursor-pointer lg:opacity-0 bottom-2 left-2"
								>
									<Image
										height={24}
										width={24}
										alt="Edit"
										src="/images/download.svg"
									/>
								</a>
							) : (
								<button
									ref={editRef}
									className="absolute z-10 transition-opacity lg:opacity-0 bottom-2 left-2"
								>
									<Image
										height={24}
										width={24}
										alt="Edit"
										src="/images/primary-pencil.svg"
									/>
								</button>
							)}
							<button
								ref={deleteRef}
								onClick={e => {
									e.stopPropagation()
									setSelectedImageForDeletion(media)
									setShowDeleteConfirmationModal(true)
								}}
								className="absolute z-10 transition-opacity lg:opacity-0 bottom-2 right-2"
							>
								<Image
									height={24}
									width={24}
									alt="Edit"
									src="/images/trash.svg"
								/>
							</button>
						</div>
					))}
				</div>
			) : (
				<div className="bg-white p-[50px] rounded-[18px]">
					<p className="text-center font-[18px] mb-[50px]">
						Welcome to MediaZs! Here, you can upload images and
						videos to promote your podcast. Our team will use these
						uploads to create ads and content for social media
						promotion. Simply click 'Upload' to get started.
						Available formats: jpeg, png, mp4, mkv, avi, mov.
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
