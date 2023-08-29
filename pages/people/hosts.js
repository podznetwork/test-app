import { Footer } from "@/components/footer"
import { Wrapper } from "@/components/Layout"
import People from "@/components/people"
function PeopleList() {
	return (
		<Wrapper>
			<People type="host" />
			<Footer />
		</Wrapper>
	)
}

export default PeopleList
