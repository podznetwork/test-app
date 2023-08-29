import { Wrapper } from "@/components/Layout"
import { SectionHeading } from "@/components/common/Typography"
import { Pricing } from "@/components/pricing"
const PricingPage = () => {
	return (
		<Wrapper>
			<div className="items-center lg:flex gap-y-4 lg:gap-x-3">
				<div
					className={`flex flex-col lg:flex-row lg:items-center gap-4`}
				>
					<div>
						<h2 className="text-lg font-medium md:text-[22px]">
							Please choose the most suitable payment plan
						</h2>
					</div>
				</div>
				<p className="text-sm text-primary">
					The price you see is the price you pay - no hidden fees and
					no surprises
				</p>
			</div>
			<Pricing />
		</Wrapper>
	)
}
export default PricingPage
