import {
	addImage,
	deleteImage,
	useGalleryImages,
	useGalleryImagesMutator
} from "@/lib/app/gallery"
import { useState } from "react"
import toast from "react-hot-toast"
import { LoadingDots } from "../common/LoadingDots"
import { DeleteConfirmationModal } from "../common/Modal"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import Image from "next/image"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"
function AddItem(props) {
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const {
		showModal,
		setShowModal,
		imagesMutator,
		images,
		setLoading,
		loading
	} = props
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [sponsored, setSponsored] = useState(false)
	const [image, setImage] = useState(null)
	const [url, setUrl] = useState("")

	const saveImage = async () => {
		if (!image) {
			setErrorMessage("No image is attached.")
			return
		}
		if (images.length >= 10) {
			setErrorMessage(
				"You are not allowed to upload more than 10 images. Please delete unnecessary images."
			)
			return
		}

		try {
			setLoading(true)
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
					setSuccessMessage("Image added successfully.")
				})
				.catch(err => {
					setErrorMessage(err.message)
				})
		} catch (e) {
			toast.error(e.message)
		}
	}

	return (
		<div
			className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center h-modal sm:h-full flex bg-black/[0.5]"
			id="add-user-modal"
			aria-modal="true"
			role="dialog"
		>
			<div className="relative w-full h-full max-w-2xl px-4 md:h-auto">
				<div className="relative bg-white rounded-lg shadow">
					<div className="flex items-start justify-between p-5 border-b rounded-t">
						<h3 className="text-xl font-semibold">Add new Image</h3>
						<button
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
							data-modal-toggle="add-user-modal"
							onClick={() => setShowModal(false)}
						>
							<svg
								className="w-5 h-5"
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

					<div className="p-6 space-y-6">
						<form>
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-3">
									<label
										htmlFor="first-name"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										Name
									</label>
									<input
										onChange={e => setName(e.target.value)}
										type="text"
										name="first-name"
										id="first-name"
										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
										placeholder="Bonnie"
										required=""
									/>
								</div>
								<div className="col-span-6 sm:col-span-3">
									<label
										htmlFor="last-name"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										Caption/Description
									</label>
									<input
										onChange={e =>
											setDescription(e.target.value)
										}
										type="text"
										name="last-name"
										id="last-name"
										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
										placeholder="Green"
										required=""
									/>
								</div>
								<div className="col-span-6">
									<label
										htmlFor="url"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										URL
									</label>
									<input
										onChange={e => setUrl(e.target.value)}
										type="text"
										name="url"
										id="url"
										className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
										placeholder="https://www.abc.com"
										required=""
									/>
								</div>
								<div className="flex items-center col-span-6 sm:col-span-3">
									<label
										htmlFor="email"
										className="block mr-2 text-sm font-medium text-gray-900"
									>
										Sponsored
									</label>
									<input
										onChange={e =>
											setSponsored(e.target.checked)
										}
										type="checkbox"
										name="email"
										id="email"
										className="block"
										placeholder="example@company.com"
										required=""
									/>
								</div>
								<div className="col-span-6 sm:col-span-3">
									<label
										htmlFor="email"
										className="mb-2 text-sm font-medium text-gray-900"
									>
										Image
									</label>
									<input
										onChange={e =>
											setImage(e.target.files[0])
										}
										type="file"
										accept="image/*"
										name="email"
										id="email"
										placeholder="example@company.com"
										required=""
										className="w-full"
									/>
								</div>
							</div>
						</form>
					</div>

					<div className="grid p-6 border-t border-gray-200 rounded-b place-items-end">
						<button
							onClick={saveImage}
							className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
							type="submit"
						>
							{loading ? <LoadingDots /> : "Save"}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
function EditGallery() {
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const [selectedImage, setSelectedImage] = useState(null)
	const { images, loading: imagesLoading } = useGalleryImages()
	const imagesMutator = useGalleryImagesMutator()

	const onDeleteClick = image => {
		setSelectedImage(image)
		setShowDeleteConfirmationModal(true)
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await deleteImage(selectedImage._id)
			imagesMutator.deleteImage(selectedImage._id)
			setShowDeleteConfirmationModal(false)
			setLoading(false)
			toast.success("Image deleted successfully.")
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	return (
		<section>
			<div className="grid grid-cols-2 py-5">
				<SectionHeading button="Add new gallery image">
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
				{showModal ? (
					<AddItem
						loading={loading}
						setLoading={setLoading}
						images={images}
						imagesMutator={imagesMutator}
						showModal={showModal}
						setShowModal={setShowModal}
					/>
				) : null}
				{/* <div className="flex justify-end">
					<button
						type="button"
						className="text-white  bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
						onClick={() => setShowModal(true)}
					>
						Add new item
					</button>
				</div> */}
			</div>
			<section>
				{imagesLoading ? (
					<Spinner />
				) : (
					<Table
						heading="Gallery Items"
						headers={["name", "description", "sponsored"]}
						fields={["name", "description", "sponsored"]}
						buttons={[
							{
								icon: (
									<Image
										src="/images/delete.svg"
										height={16}
										width={16}
										alt="Delete Price"
									/>
								)
							}
						]}
						buttonFunctions={[onDeleteClick]}
						data={images}
					/>
				)}
			</section>
		</section>
	)
}

export default EditGallery
