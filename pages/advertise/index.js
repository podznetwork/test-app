import Advertise from "@/components/advertise"
import { Footer } from "@/components/footer"
import { Wrapper } from "@/components/Layout"

function AdvertisePage() {
	return (
		<Wrapper>
			<Advertise />
			<div className="mt-16"></div>
			<Footer />
		</Wrapper>
	)
}

export default AdvertisePage
