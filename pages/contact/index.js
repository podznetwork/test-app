import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Wrapper } from "@/components/Layout"

const ContactPage = () => {
	return (
		<Wrapper>
			<Contact />
			<div className="mt-16"></div>
			<Footer />
		</Wrapper>
	)
}

export default ContactPage
