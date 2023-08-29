//Moved to Host Requests page

// import {
// 	changePodcastHostStatus,
// 	useHostPodcasts,
// 	useHostPodcastsMutator
// } from "@/lib/app/podcast"
// import { useState } from "react"
// import toast from "react-hot-toast"
// import Spinner from "../common/Spinner"
// import Table from "../common/Table"

// export default function Requests() {
// 	const { podcasts, loading: podcastsLoading } = useHostPodcasts()
// 	const [loading, setLoading] = useState(false)
// 	const confirmedPodcasts = podcasts?.filter(
// 		podcast => podcast.hosts.confirmed
// 	)
// 	const podcastsMutator = useHostPodcastsMutator()

// 	const handleUnconfirmClick = async podcast => {
// 		try {
// 			setLoading(true)
// 			const updatedPodcast = await changePodcastHostStatus(
// 				podcast._id,
// 				false
// 			)
// 			podcastsMutator.updatePodcast(updatedPodcast)
// 			toast.success("Podcast unconfirmed successfully.")
// 			setLoading(false)
// 		} catch (e) {
// 			setLoading(false)
// 			toast.error(e.message)
// 		}
// 	}
// 	return (
// 		<>
// 			{podcastsLoading || loading ? (
// 				<Spinner />
// 			) : (
// 				<Table
// 					heading="Approved Podcasts"
// 					headers={["name", "description", "genre"]}
// 					fields={["name", "description", "genre"]}
// 					buttons={["Unconfirm"]}
// 					buttonFunctions={[handleUnconfirmClick]}
// 					data={confirmedPodcasts}
// 				/>
// 			)}
// 		</>
// 	)
// }
