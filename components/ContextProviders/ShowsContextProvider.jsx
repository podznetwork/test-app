import { useAllPodcasts } from "@/lib/app/podcast"
import { createContext } from "react"

export const ShowsContext = createContext()

function ShowsContextProvider({ children }) {
	const { podcasts, loading } = useAllPodcasts(false, 3)

	return (
		<ShowsContext.Provider value={{ podcasts }}>
			{children}
		</ShowsContext.Provider>
	)
}

export default ShowsContextProvider
