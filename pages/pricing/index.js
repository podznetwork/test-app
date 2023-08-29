import { Footer } from "@/components/footer"
import { Wrapper } from "@/components/Layout"
import { Pricing } from "@/components/pricing"
const PricingPage = () => {
	return (
		<Wrapper>
			<div className="flex flex-col gap-5 mb-8">
				<div className="max-w-screen-md mx-auto text-center">
					<h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
						Designed for Podcasters like yourself
					</h2>
					<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
						The price you see is the price you pay - no hidden fees
						and no surprises.
					</p>
				</div>
				<Pricing />
			</div>
			<Footer />
		</Wrapper>
	)
}
export default PricingPage
