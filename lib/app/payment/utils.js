import { cancelSubscription, getSubscription, refundUser } from "./requests"

function getCeilDaysDifference(date1, date2) {
	const diffTime = Math.abs(date2 - date1)
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	return diffDays
}

function getFloorDaysDifference(date1, date2) {
	const diffTime = Math.abs(date2 - date1)
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
	return diffDays
}

export function getPlanSubscriptionButton(userPlan, currentPlanPrice) {
	if (!userPlan) {
		return "Subscribe"
	}

	const planPrice = userPlan.discountedPrice || userPlan.price

	if (planPrice <= currentPlanPrice) {
		return "Upgrade"
	} else {
		return "Downgrade"
	}
}

export function calculateReaminingAmount(subscriptionDetails) {
	const startDate = new Date(
		subscriptionDetails.billing_info.last_payment.time
	)
	const paidAmount = parseFloat(
		subscriptionDetails.billing_info.last_payment.amount.value
	)
	const nextBillingDate = new Date(
		subscriptionDetails.billing_info.next_billing_time
	)
	const costPerDay =
		paidAmount / getCeilDaysDifference(nextBillingDate, startDate)
	const remainingDays = getFloorDaysDifference(nextBillingDate, new Date())

	return parseFloat(costPerDay * remainingDays).toFixed(2)
}

export async function refundAmount(subscriptionDetails, amount) {
	await refundUser({
		items: [
			{
				receiver: subscriptionDetails.subscriber.email_address,
				amount: {
					currency: "USD",
					value: parseFloat(amount)
				},
				recipient_type: "EMAIL"
			}
		],
		sender_batch_header: {}
	})
}

export async function cancelUserSubscription(
	subscriptionId,
	ownerRequestMutator,
	userMutator,
	options
) {
	const subscriptionDetails = await getSubscription(subscriptionId)
	const remainingAmount = calculateReaminingAmount(subscriptionDetails)
	await refundAmount(subscriptionDetails, remainingAmount)
	const { updatedRequest, updatedUser } = await cancelSubscription(
		subscriptionId,
		options.sendEmail
	)
	ownerRequestMutator.addRequest(updatedRequest)
	userMutator.updateUser(updatedUser)
}
