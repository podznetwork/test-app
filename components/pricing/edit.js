import {
	createSubscriptionPlan,
	updateSubscriptionPricing
} from "@/lib/app/payment"
import {
	addPricingPlan,
	deletePricingPlan,
	editPricingPlan,
	usePricingPlans,
	usePricingPlansMutator
} from "@/lib/app/pricing"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { DeleteConfirmationModal } from "../common/Modal"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import Image from "next/image"
import { Input } from "../common/Input"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
function AddPricingPlan(props) {
	const {
		showModal,
		setShowModal,
		pricingPlansMutator,
		selectedPlan,
		setSelectedPlan
	} = props

	const nameRef = useRef()
	const descriptionRef = useRef()
	const priceRef = useRef()
	const discountedPriceRef = useRef()
	const captionRef = useRef()
	const numberOfPodcastsRef = useRef()
	const featureRef = useRef()
	const [features, setFeatures] = useState([])

	const [loading, setLoading] = useState(false)

	const onSubmit = async e => {
		e.preventDefault()
		try {
			setLoading(true)
			const plan = {
				name: nameRef.current.value,
				description: descriptionRef.current.value,
				price: parseFloat(priceRef.current.value),
				discountedPrice:
					isNaN(discountedPriceRef.current.value) ||
					discountedPriceRef.current.value === ""
						? ""
						: parseFloat(discountedPriceRef.current.value),
				caption: captionRef.current.value,
				numberOfPodcasts: parseInt(numberOfPodcastsRef.current.value),
				features
			}
			if (selectedPlan) {
				if (
					selectedPlan.price !== plan.price ||
					selectedPlan.discountedPrice !== plan.discountedPrice
				) {
					const updatedPlanPricing = {
						pricing_schemes: [
							{
								billing_cycle_sequence: 1,
								pricing_scheme: {
									fixed_price: {
										value: plan.discountedPrice
											? plan.discountedPrice.toString()
											: plan.price.toString(),
										currency_code: "USD"
									}
								}
							}
						]
					}
					await updateSubscriptionPricing({
						planId: selectedPlan.paypalPlanId,
						updatedPlanPricing
					})
				}
				const updatedPlan = await editPricingPlan(
					selectedPlan._id,
					plan
				)
				pricingPlansMutator.updatePricingPlan(updatedPlan)
				toast.success("Plan updated successfully.")
				setSelectedPlan(null)
			} else {
				const paypalPlanData = {
					product_id: process.env.NEXT_PUBLIC_PODZ_PRODUCT_ID,
					name: plan.name,
					description: plan.description,
					status: "ACTIVE",
					billing_cycles: [
						{
							frequency: {
								interval_unit: "MONTH",
								interval_count: 1
							},
							tenure_type: "REGULAR",
							sequence: 1,
							total_cycles: 0,
							pricing_scheme: {
								fixed_price: {
									value: plan.discountedPrice
										? plan.discountedPrice.toString()
										: plan.price.toString(),
									currency_code: "USD"
								}
							}
						}
					],
					payment_preferences: {
						auto_bill_outstanding: true,
						setup_fee_failure_action: "CONTINUE",
						payment_failure_threshold: 1
					}
				}
				const response = await createSubscriptionPlan(paypalPlanData)
				plan.paypalPlanId = response.id
				const planId = await addPricingPlan(plan)
				pricingPlansMutator.addPricingPlan({
					_id: planId,
					...plan
				})
				toast.success("Plan added successfully.")
			}
			setLoading(false)
			setShowModal(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	useEffect(() => {
		if (selectedPlan) {
			nameRef.current.value = selectedPlan.name
			descriptionRef.current.value = selectedPlan.description
			priceRef.current.value = selectedPlan.price
			captionRef.current.value = selectedPlan.caption
			numberOfPodcastsRef.current.value =
				selectedPlan.numberOfPodcasts ?? 1
			discountedPriceRef.current.value =
				selectedPlan.discountedPrice ?? ""
			setFeatures(selectedPlan.features)
		}
	}, [selectedPlan])

	return (
		<div>
			<div>
				<div className="flex flex-row gap-x-2">
					<button
						onClick={() => {
							setShowModal(false)
							setSelectedPlan(null)
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
					<SectionHeading>Add new plan</SectionHeading>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
				<Input
					className="col-span-1"
					label="Plan name"
					placeholder="Plan 3"
					ref={nameRef}
					type="text"
				/>
				<Input
					className="col-span-1"
					required
					label="Plan Description"
					placeholder="Description Text"
					ref={descriptionRef}
					type="text"
				/>
				<Input
					className="col-span-1"
					required
					label="Pricing ($)"
					placeholder="9.99"
					ref={priceRef}
					type="text"
				/>
				<Input
					required
					className="col-span-1"
					label="Discounted Price ($)"
					placeholder="8.99"
					ref={discountedPriceRef}
					type="text"
				/>
				<Input
					required
					className="col-span-1"
					label="Pricing Caption (/month)"
					placeholder="3"
					ref={captionRef}
					type="text"
				/>
				<Input
					required
					className="col-span-1"
					label="Number of Podcasts"
					placeholder="3"
					ref={numberOfPodcastsRef}
					type="text"
				/>
				<div className="w-full col-span-2">
					<p className="pb-2 text-xs font-semibold">
						Pricing Features
					</p>
					{features?.map((feature, index) => (
						<div
							key={index}
							className="flex items-center w-full mt-1 gap-x-2"
						>
							<div className="grow bg-white rounded-[14px] border border-[#f2f2f2] h-[50px] px-[15px] py-0 text-xs flex items-center">
								{feature}
							</div>
							<button
								onClick={() => {
									const newFeatures = features
									newFeatures.splice(index, 1)
									setFeatures([...newFeatures])
								}}
								className="rotate-45"
							>
								<Image
									src="/images/add_feature.svg"
									height={18}
									width={18}
									alt="Add feature Button"
								/>
							</button>
						</div>
					))}
					<div className="flex items-center col-span-2 mt-2 gap-x-2">
						<Input
							ref={featureRef}
							className="grow"
							placeholder="Feature"
						/>
						<button
							onClick={() => {
								setFeatures([
									...features,
									featureRef.current.value
								])
								featureRef.current.value = ""
							}}
						>
							<Image
								src="/images/add_feature.svg"
								height={18}
								width={18}
								alt="Add feature Button"
							/>
						</button>
					</div>
				</div>
			</div>

			<div className="mt-4 flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
				<Button
					onClick={onSubmit}
					loading={loading}
					variant={buttonVariants.PRIMARY}
					className="w-full lg:max-w-[240px]"
				>
					Save
				</Button>
				<Button
					onClick={() => setShowModal(false)}
					variant={buttonVariants.SECONDARY}
					className="w-full lg:max-w-[240px]"
				>
					Cancel
				</Button>
			</div>
		</div>
	)
}

function PriceCard({ plan, deleteClick, editClick, showButtons }) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<h3 className="font-semibold text-primary">{plan.name}</h3>
			<p>{plan.description}</p>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Price</h4>
				<p>{plan.price}</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Caption</h4>
				<p>{plan.caption}</p>
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

function EditComponent() {
	const [showModal, setShowModal] = useState(false)
	const [selectedPlanForDeletion, setSelectedPlanForDeletion] = useState(null)
	const [selectedPlanForEdit, setSelectedPlanForEdit] = useState(null)
	const [loading, setLoading] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const { plans } = usePricingPlans()
	const pricingPlansMutator = usePricingPlansMutator()

	const onDeleteClick = plan => {
		setSelectedPlanForDeletion(plan)
		setShowDeleteConfirmationModal(true)
	}

	const onEditClick = plan => {
		setSelectedPlanForEdit(plan)
		setShowModal(true)
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await deletePricingPlan(selectedPlanForDeletion._id)
			pricingPlansMutator.deletePricingPlan(selectedPlanForDeletion._id)
			setShowDeleteConfirmationModal(false)
			toast.success("Plan deleted successfully.")
			setLoading(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	return showModal ? (
		<AddPricingPlan
			pricingPlansMutator={pricingPlansMutator}
			showModal={showModal}
			setShowModal={setShowModal}
			selectedPlan={selectedPlanForEdit}
			setSelectedPlan={setSelectedPlanForEdit}
		/>
	) : (
		<section>
			<div className="grid grid-cols-2 py-5">
				{/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Edit Pricing Plans
				</h5> */}
				<SectionHeading
					button="Add new plan"
					buttonOnClick={() => {
						plans?.length < 3
							? setShowModal(true)
							: toast.error("No more than 3 plans can be added.")
					}}
				>
					Pricing Plans
				</SectionHeading>
				{showDeleteConfirmationModal && (
					<DeleteConfirmationModal
						message="Are you sure that you want to delete this plan?"
						onClose={() => setShowDeleteConfirmationModal(false)}
						onConfirm={onDelete}
						loading={loading}
					/>
				)}
				{}
			</div>
			<section>
				{plans?.length > 0 ? (
					<>
						<Table
							className="hidden lg:block"
							heading=""
							caption="Note: A maximum of three plans can be added and
								edited at the same time."
							headers={[
								"name",
								"description",
								"price",
								"caption"
							]}
							fields={["name", "description", "price", "caption"]}
							buttons={[
								{
									icon: (
										<Image
											src="/images/edit.svg"
											height={16}
											width={16}
											alt="Edit Price"
										/>
									)
								},
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
							buttonFunctions={[onEditClick, onDeleteClick]}
							data={plans}
						/>
						<div className="flex flex-col gap-5 lg:hidden">
							{plans?.map(plan => (
								<PriceCard
									key={plan._id}
									plan={plan}
									editClick={() => onEditClick(plan)}
									deleteClick={() => onDeleteClick(plan)}
									showButtons
								/>
							))}
						</div>
					</>
				) : (
					<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
						Currenly, there are no pricing plans to show.
					</div>
				)}
			</section>
		</section>
	)
}

export default EditComponent
