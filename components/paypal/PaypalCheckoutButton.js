import {
	addPayment,
	cancelUserSubscription,
	getPlanSubscriptionButton
} from "@/lib/app/payment"
import { addPricingPlan } from "@/lib/app/user"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"
import { LoadingDots } from "../common/LoadingDots"
import { DeleteConfirmationModal, Modal } from "../common/Modal"
import { useSession } from "next-auth/react"

const PaypalCheckoutButton = props => {
	const { data: session, update } = useSession()
	const { product, requestId, ownerRequestMutator, user, userMutator } = props
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const router = useRouter()
	const previousSubscription = useRef(null)

	const resubscribe = async (actions, user, product) => {
		const response = await actions.subscription.create({
			plan_id: product.paypalPlanId
		})
		previousSubscription.current = user.subscriptionId
		return response
	}

	const handleCancel = async subscriptionId => {
		try {
			setLoading(true)
			await cancelUserSubscription(
				subscriptionId,
				ownerRequestMutator,
				userMutator,
				{ sendEmail: false }
			)
			setLoading(false)
			toast.success("Successfully unsubscribed from plan.")
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	const handleApprove = async orderId => {
		try {
			setLoading(true)
			const { updatedRequest, updatedUser } = await addPayment({
				orderId,
				amount: product.price,
				pricingPlan: "p1",
				requestId
			})
			if (!user?.access?.includes("owner")) {
				userMutator.updateUser(updatedUser)
				ownerRequestMutator.addRequest(updatedRequest)
			}
			await addPricingPlan(user._id, {
				plan: product.planId,
				subscriptionId: orderId
			})
			if (!session.user?.access?.includes("owner")) {
				update({
					access: [...session.user.access, "owner"]
				})
			}
			toast.success("Thank you for your purchase.", {
				duration: 4000
			})
			setTimeout(() => {
				router.replace("/podcasts?refresh=true")
			}, 2000)
		} catch (e) {
			toast(e.message)
		} finally {
			setLoading(false)
		}

		if (error) {
			toast(error.message)
		}
	}

	if (loading) {
		return (
			<Modal noCancel>
				<div className="text-lg text-center">
					Processing your transaction. Please wait.
				</div>
				<LoadingDots />
			</Modal>
		)
	}

	return (
		<>
			{user?.plan?._id !== product.planId ? (
				<div className="relative items-center rounded-[100px] border border-gray-500 hover:bg-gray-100 h-auto min-h-12">
					<span className="flex items-center justify-center absolute top-[50%] text-lg -translate-y-[50%] left-0 right-0 mx-auto w-[200px]">
						<img className="w-[16px] mr-2" src="/paypal.svg" />
						{getPlanSubscriptionButton(user?.plan, product.price)}
					</span>
					<PayPalButtons
						style={{
							color: "silver",
							layout: "horizontal",
							height: 48,
							tagline: false,
							shape: "pill"
						}}
						createSubscription={async (data, actions) => {
							switch (
								getPlanSubscriptionButton(
									user?.plan,
									product.price
								)
							) {
								case "Upgrade": {
									return await resubscribe(
										actions,
										user,
										product
									)
								}
								case "Downgrade":
									return await resubscribe(
										actions,
										user,
										product
									)
								default: {
									return await actions.subscription.create({
										plan_id: product.paypalPlanId
									})
								}
							}
						}}
						onApprove={async (data, actions) => {
							switch (
								getPlanSubscriptionButton(
									user?.plan,
									product.price
								)
							) {
								case "Upgrade": {
									await cancelUserSubscription(
										previousSubscription.current,
										ownerRequestMutator,
										userMutator,
										{ sendEmail: false }
									)
									break
								}
								case "Downgrade":
									await cancelUserSubscription(
										previousSubscription.current,
										ownerRequestMutator,
										userMutator,
										{ sendEmail: false }
									)
									break
							}
							handleApprove(data.subscriptionID)
						}}
						onError={err => {
							setError(err)
							console.error("PayPal Checkout onError", err)
						}}
						onCancel={async () => {
							router.replace("/requests/access")
						}}
					/>
				</div>
			) : (
				<>
					{showDeleteConfirmationModal &&
						createPortal(
							<DeleteConfirmationModal
								onClose={() =>
									setShowDeleteConfirmationModal(false)
								}
								loading={loading}
								onConfirm={() =>
									handleCancel(user?.subscriptionId)
								}
								heading={"Cancel Subscription"}
								message="Are you sure you want to cancel your subscription to Podz Network?"
							/>,
							document.body
						)}
					<button
						className="w-full py-[14px] text-white mx-auto text-lg bg-red-500 border-0 rounded-[100px] hover:bg-red-600"
						onClick={() => setShowDeleteConfirmationModal(true)}
					>
						{loading ? (
							<LoadingDots className="mx-auto" />
						) : (
							"Cancel Subscription"
						)}
					</button>
				</>
			)}
		</>
	)
}

export default PaypalCheckoutButton
