import {
	addImage,
	deleteImage,
	editImage,
	useGalleryImages,
	useGalleryImagesMutator
} from "@/lib/app/gallery"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { LoadingDots } from "../common/LoadingDots"
import { DeleteConfirmationModal, Modal } from "../common/Modal"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import Image from "next/image"
import {
	updatePodcast,
	useAllPodcasts,
	usePodcastsMutator
} from "@/lib/app/podcast"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { Input } from "../common/Input"
import { ToggleButton } from "../common/ToggleButton"
import { SelectInput } from "../common/Input/SelectInput"

function GalleryImageCard({ image, editClick, deleteClick, showButtons }) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">{image.name}</h4>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Description</h4>
				<p>{image.description}</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Sponsored</h4>
				<p>
					{image.sponsored ? (
						<span>Sponsored</span>
					) : (
						<span className="text-[#E55C5C]">Not Sponsored</span>
					)}
				</p>
			</div>
			{showButtons && (
				<div className="flex gap-x-[10px]">
					<button
						onClick={editClick}
						className="px-10 py-2 text-white bg-primary rounded-[18px]"
					>
						Edit
					</button>
					<button
						onClick={deleteClick}
						className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
					>
						Delete
					</button>
				</div>
			)}
		</div>
	)
}

function FeaturedCard({ podcast, unfeatureClick }) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">{podcast.name}</h4>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Description</h4>
				<p>{podcast.description}</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Sponsored</h4>
				<p>
					{podcast.genre.map((gen, index) => (
						<span key={index}>
							{gen} {index < podcast.genre.length - 1 ? "," : ""}
						</span>
					))}
				</p>
			</div>
			<div className="flex gap-x-[10px]">
				<Button
					onClick={unfeatureClick}
					variant={buttonVariants.PRIMARY}
				>
					Unfeature
				</Button>
			</div>
		</div>
	)
}

function AddEditGallery(props) {
	const {
		showModal,
		setShowModal,
		imagesMutator,
		images,
		setLoading,
		loading,
		selectedImage,
		setSelectedImage
	} = props
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [sponsored, setSponsored] = useState(false)
	const [image, setImage] = useState(null)
	const [url, setUrl] = useState("")
	const [imageUrl, setImageUrl] = useState("")

	const saveImage = async () => {
		if (!image && !selectedImage) {
			toast.error("No image is attached.")
			return
		}
		if (images.length >= 10) {
			toast.error(
				"You are not allowed to upload more than 10 images. Please delete unnecessary images."
			)
			return
		}

		try {
			setLoading(true)
			if (image) {
				const imageData = new FormData()
				imageData.append("file", image)
				imageData.append(
					"upload_preset",
					process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
				)
				imageData.append(
					"cloud_name",
					process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD
				)

				fetch(
					`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
					{
						method: "post",
						body: imageData
					}
				)
					.then(response => response.json())
					.then(async data => {
						if (selectedImage) {
							const updatedImage = {
								name,
								description,
								sponsored,
								path: data.url,
								url,
								updatedAt: new Date()
							}
							await editImage(selectedImage._id, updatedImage)
							imagesMutator.updateImage(
								selectedImage._id,
								updatedImage
							)
							setSelectedImage(null)
							setShowModal(false)
							setLoading(false)
							toast.success("Image updated successfully.")
						} else {
							const imageId = await addImage({
								path: data.url,
								name,
								description,
								sponsored,
								url
							})
							imagesMutator.addImage({
								_id: imageId,
								path: data.url,
								name,
								description,
								sponsored,
								url
							})
							setShowModal(false)
							setLoading(false)
							toast.success("Image added successfully.")
						}
					})
					.catch(err => {
						console.log(err)
						toast.error(err.message)
					})
			} else {
				const updatedImage = {
					name,
					description,
					sponsored,
					path: selectedImage.path,
					url,
					updatedAt: new Date()
				}
				await editImage(selectedImage._id, updatedImage)
				imagesMutator.updateImage(selectedImage._id, updatedImage)
				toast.success("Image updated successfully.")
				setShowModal(false)
				setLoading(false)
			}
		} catch (e) {
			toast.error(e.message)
		}
	}

	useEffect(() => {
		if (selectedImage) {
			setName(selectedImage.name)
			setDescription(selectedImage.description)
			setSponsored(selectedImage.sponsored)
			setUrl(selectedImage.path)
			setImageUrl(selectedImage.path)
		}
	}, [selectedImage])

	return (
		<div>
			<div>
				<div className="flex flex-row gap-x-2">
					<button
						onClick={() => {
							setShowModal(false)
							setSelectedImage(null)
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
					<SectionHeading>Add new gallery image</SectionHeading>
				</div>
			</div>
			<form className="flex flex-col w-full gap-5 mt-6 lg:w-1/2">
				<Input
					className="w-full"
					required
					type="text"
					label="Name"
					placeholder="image"
					value={name}
					onChange={e => setName(e.target.value)}
				/>
				<Input
					className="w-full"
					required
					type="text"
					label="Caption/Description"
					placeholder="Description Text"
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<Input
					className="w-full"
					type="text"
					label="URL"
					placeholder="https://abc.com"
					value={url}
					onChange={e => setUrl(e.target.value)}
				/>
				<ToggleButton
					label="Sponsored"
					checked={sponsored}
					onChange={e => setSponsored(e.target.checked)}
				/>
				<div className="relative">
					<p className="mb-4 text-sm font-semibold">Logo</p>
					<label className="p-2 block w-28 text-sm flex items-center justify-center h-28 border rounded-[18px] border-dashed border-[#4B5563]">
						Upload your photo
						<input
							onChange={e => setImage(e.target.files[0])}
							accept="image/*"
							type="file"
							className="hidden"
						/>
					</label>
					{imageUrl && (
						<div className="absolute bottom-0 bg-white rounded-[18px] ">
							<input
								accept="image/*"
								type="file"
								onChange={e => setImage(e.target.files[0])}
								className="absolute inset-0 z-10 w-full h-full border-gray-300 rounded-full opacity-0 cursor-pointer"
							/>
							<Image
								className="rounded-[18px]"
								src={imageUrl}
								alt="Profile Picture"
								height={112}
								width={112}
							/>
						</div>
					)}
				</div>
				{image && (
					<div className="flex justify-between text-sm truncate">
						<p>{image.name}</p>
						<button onClick={() => setImage(null)}>
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
				<div className="flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
					<Button
						onClick={saveImage}
						loading={loading}
						variant={buttonVariants.PRIMARY}
						className="w-full lg:max-w-[240px]"
					>
						{selectedImage
							? "Save Changes"
							: "Add new gallery image"}
					</Button>
					<Button
						onClick={() => {
							setSelectedImage(null)
							setShowModal(false)
						}}
						variant={buttonVariants.SECONDARY}
						className="w-full lg:max-w-[240px]"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	)
}

function AddEditFeatured(props) {
	const { showModal, setShowModal, podcastMutator, loading, setLoading } =
		props
	const [selectedPodcast, setSelectedPodcast] = useState(false)

	const { podcasts } = useAllPodcasts()
	const unfeaturedPodcasts = podcasts?.filter(podcast => !podcast.featured)
	const podcastOptions = unfeaturedPodcasts?.map(podcast => ({
		label: podcast.name,
		value: podcast._id
	}))

	const onSubmit = async event => {
		event.preventDefault()
		try {
			setLoading(true)
			const updatedPodcast = await updatePodcast(selectedPodcast, {
				featured: true
			})
			podcastMutator.updatePodcast(updatedPodcast)
			setLoading(false)
			setShowModal(false)
			toast.success("Podcast featured successfully.")
		} catch (e) {
			toast.error(e.message)
		}
	}

	return (
		<Modal onClose={() => setShowModal(false)}>
			<div className="flex flex-col gap-5">
				<h3 className="font-semibold text-[18px] text-center">
					Add new featured podcast
				</h3>
				<SelectInput
					onChange={option => setSelectedPodcast(option.value)}
					options={podcastOptions}
				/>
				<div className="flex flex-col items-center justify-center md:flex-row gap-7">
					<Button
						loading={loading}
						onClick={onSubmit}
						variant={buttonVariants.PRIMARY}
						className="w-full md:w-[180px]"
					>
						Add
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

function Landing() {
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const [showFeaturedModal, setShowFeaturedModal] = useState(false)
	const [featuredLoading, setFeaturedLoading] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const [selectedImage, setSelectedImage] = useState(null)
	const [selectedImagForEdit, setSelectedImageForEdit] = useState(null)
	const { images, loading: imagesLoading } = useGalleryImages()
	const imagesMutator = useGalleryImagesMutator()

	const onDeleteClick = image => {
		setSelectedImage(image)
		setShowDeleteConfirmationModal(true)
	}

	const onEditClick = image => {
		setSelectedImageForEdit(image)
		setShowModal(true)
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await deleteImage(selectedImage._id)
			imagesMutator.deleteImage(selectedImage._id)
			setShowDeleteConfirmationModal(false)
			setSelectedImage(null)
			setLoading(false)
			toast.success("Image deleted successfully.")
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	const { podcasts, loading: podcastsLoading } = useAllPodcasts()
	const podcastMutator = usePodcastsMutator("/all-podcasts")

	const featuredPodcasts = podcasts?.filter(podcast => podcast.featured)

	const unfeaturePodcast = async podcast => {
		try {
			const updatedPodcast = await updatePodcast(podcast._id, {
				featured: false
			})
			podcastMutator.updatePodcast(updatedPodcast)
			toast.success("Podcast unfeatured successfully.")
		} catch (e) {
			toast.error(e.message)
		}
	}

	return !showModal ? (
		<div className="flex flex-col gap-5">
			<section className="flex flex-col gap-5">
				<SectionHeading
					button="Add new gallery image"
					buttonOnClick={() => setShowModal(true)}
				>
					Gallery Images
				</SectionHeading>
				{showDeleteConfirmationModal && (
					<DeleteConfirmationModal
						message="Are you sure that you want to delete this image?"
						onClose={() => setShowDeleteConfirmationModal(false)}
						onConfirm={onDelete}
						loading={loading}
					/>
				)}
				{showFeaturedModal && (
					<AddEditFeatured
						showModal={showFeaturedModal}
						setShowModal={setShowFeaturedModal}
						setSele
						podcastMutator={podcastMutator}
						loading={featuredLoading}
						setLoading={setFeaturedLoading}
					/>
				)}
				<section>
					{imagesLoading ? (
						<Spinner />
					) : (
						<>
							{images?.length > 0 ? (
								<>
									<Table
										className="hidden lg:block"
										headers={[
											"name",
											"description",
											"sponsored"
										]}
										fields={[
											"name",
											"description",
											"sponsored"
										]}
										buttons={[
											{
												icon: (
													<Image
														src="/images/edit.svg"
														height={16}
														width={16}
														alt="Edit Image"
													/>
												)
											},
											{
												icon: (
													<Image
														src="/images/delete.svg"
														height={16}
														width={16}
														alt="Delete Image"
													/>
												)
											}
										]}
										buttonFunctions={[
											onEditClick,
											onDeleteClick
										]}
										data={images}
									/>
									<div className="flex flex-col gap-5 lg:hidden">
										{images.map(image => (
											<GalleryImageCard
												image={image}
												editClick={() =>
													onEditClick(image)
												}
												deleteClick={() =>
													onDeleteClick(image)
												}
												showButtons
												key={image._id}
											/>
										))}
									</div>
								</>
							) : (
								<div className="flex bg-white rounded-[14px] min-h-[300px] items-center justify-center">
									Currenly, there are no gallery images to
									show.
								</div>
							)}
						</>
					)}
				</section>
			</section>
			<section className="flex flex-col gap-5">
				<SectionHeading
					button="Add new featured items"
					buttonOnClick={() => setShowFeaturedModal(true)}
				>
					Featured Items
				</SectionHeading>
				<section>
					{podcastsLoading ? (
						<Spinner />
					) : (
						<>
							{featuredPodcasts?.length > 0 ? (
								<>
									<Table
										className="hidden lg:block"
										heading="Featured Items"
										headers={[
											"name",
											"description",
											"hosts",
											"genre"
										]}
										fields={[
											"name",
											"description",
											"hosts",
											"genre"
										]}
										buttons={[
											{
												icon: (
													<Button
														className="text-xs"
														variant={
															buttonVariants.PRIMARY
														}
													>
														Unfeature
													</Button>
												)
											}
										]}
										buttonFunctions={[unfeaturePodcast]}
										data={featuredPodcasts}
									/>
									<div className="flex flex-col gap-5 lg:hidden">
										{featuredPodcasts?.map(podcast => (
											<FeaturedCard
												key={podcast._id}
												podcast={podcast}
												unfeatureClick={() =>
													unfeaturePodcast(podcast)
												}
											/>
										))}
									</div>
								</>
							) : (
								<div className="flex bg-white rounded-[14px] min-h-[300px] items-center justify-center">
									Currenly, there are no featured podcasts to
									show.
								</div>
							)}
						</>
					)}
				</section>
			</section>
			{/* <EditGallery />
			<EditFeatured /> */}
		</div>
	) : (
		<>
			{showModal && (
				<AddEditGallery
					loading={loading}
					selectedImage={selectedImagForEdit}
					setSelectedImage={setSelectedImageForEdit}
					setLoading={setLoading}
					images={images}
					imagesMutator={imagesMutator}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</>
	)
}

export default Landing
