import { Footer } from "@/components/footer"
import { Wrapper } from "@/components/Layout"
import ShowsList from "@/components/shows"
function AllShows() {
	return (
		<Wrapper>
			<ShowsList />
			<Footer />
		</Wrapper>
	)
}

export default AllShows
