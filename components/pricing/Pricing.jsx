import { usePricingPlans } from "@/lib/app/pricing"
import { useRequest, useRequestMutator } from "@/lib/app/request"
import { useCurrentUser, useUserMutator } from "@/lib/app/user"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "../common/Button"
import Spinner from "../common/Spinner"
import PaypalCheckoutButton from "../paypal/PaypalCheckoutButton"
import { SectionHeading } from "../common/Typography"
const checkIfOwner = (
	ownerRequestMutator,
	ownerRequest,
	plan,
	user,
	userMutator
) => {
	if (
		ownerRequest?.status === "approved" ||
		user?.access?.includes("owner")
	) {
		return (
			<PaypalCheckoutButton
				// requestId={ownerRequest._id}
				ownerRequestMutator={ownerRequestMutator}
				user={user}
				product={{
					description: plan.description,
					planId: plan._id,
					paypalPlanId: plan.paypalPlanId,
					price: plan.discountedPrice ?? plan.price
				}}
				userMutator={userMutator}
			/>
		)
	}
	if (ownerRequest?.status === "paid") {
		return (
			<div
				className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
				role="alert"
			>
				You already have access to owner account.
			</div>
		)
	}
	return (
		<>
			<div
				className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
				role="alert"
			>
				You need to have an owner request before you pay.
				<br></br>
				<Link href={"/requests/access"}>
					<a className="underline">Click here</a>
				</Link>{" "}
				to get owner request
			</div>
		</>
	)
}

const Pricing = () => {
	const { status } = useSession()
	const { user } = useCurrentUser()
	const { request: ownerRequest } = useRequest(
		status === "authenticated" ? "owner" : null
	)
	const ownerRequestMutator = useRequestMutator("owner")
	const { plans, loading: plansLoading } = usePricingPlans()
	const userMutator = useUserMutator()

	return (
		<section className="pb-4">
			<div>
				<div className="mt-4 flex flex-wrap items-stretch justify-center gap-x-[2%] gap-y-5 space-between">
					{plansLoading ? (
						<Spinner />
					) : (
						plans?.map(plan => (
							<div
								key={plan._id}
								className={clsx(
									"basis-full lg:basis-[30%] flex flex-col p-6 max-w-full lg:max-w-[33%] text-center text-gray-900 bg-white rounded-[14px] border border-[#f2f2f2] dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white",
									user?.plan?._id === plan._id &&
										"border-2 border-primary"
								)}
							>
								<h3 className="mb-2 text-lg font-semibold">
									{plan.name}
									{plan._id === user?.plan?._id && (
										<span className="block text-xs">
											(Current Plan)
										</span>
									)}
								</h3>
								<p className="text-xs font-light text-gray-500 dark:text-gray-400 min-h-[50px]">
									{plan.description}
								</p>
								<div className="flex flex-col items-center my-6 justify-baseline">
									{plan.discountedPrice &&
										plan.discountedPrice !== plan.price && (
											<sup className="mr-2 text-sm text-gray-500 line-through">
												${plan.price.toFixed(2)}
											</sup>
										)}
									<div className="flex items-center justify-center">
										<span className="mr-2 text-lg font-semibold text-primary">
											$
											{plan.discountedPrice?.toFixed(2) ??
												plan.price.toFixed(2)}{" "}
											/
										</span>
										<span className="text-gray-500 dark:text-gray-400">
											month
										</span>
									</div>
								</div>

								<ul
									role="list"
									className="mb-8 space-y-4 text-left max-w-[400px] mx-auto"
								>
									{plan.features?.map((feature, index) => (
										<li
											key={index}
											className="flex items-center space-x-3"
										>
											<svg
												className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
												fill="black"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												></path>
											</svg>
											<span>{feature}</span>
										</li>
									))}
								</ul>
								<div className="mt-auto paypal-button-container">
									{status === "authenticated" ? (
										checkIfOwner(
											ownerRequestMutator,
											ownerRequest,
											plan,
											user,
											userMutator
										)
									) : (
										<div className="flex gap-x-12">
											<Link href="/login">
												<Button className="w-1/2 border-primary-400 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
													Login
												</Button>
											</Link>
											<Link href="/register">
												<Button className="w-1/2 border-primary-400 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
													Sign Up
												</Button>
											</Link>
										</div>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</section>
	)
}
export default Pricing
