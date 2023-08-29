import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import DashboardTopbar from "./DashboardTopbar"
import { useErrorContext } from "@/components/ContextProviders/ErrorContextProvider"
import { Modal } from "@/components/common/Modal"
import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
function isAuthenticated(status, session, children, router) {
	const publicPaths = [
		"/",
		"/about",
		"/advertise",
		"/contact",
		"/people",
		"/people/guests",
		"/people/crew",
		"/people/hosts",
		"/shows/[name]",
		"/shows/[name]/[episodeId]",
		"/pricing",
		"/shows"
	]
	if (status === "authenticated" && !publicPaths.includes(router.pathname)) {
		return (
			<PayPalScriptProvider
				options={{
					"client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
					vault: true
				}}
			>
				<div className="flex flex-col lg:flex-row">
					<Sidebar />
					<main className="w-full overflow-x-none">
						<DashboardTopbar />
						{children}
					</main>
				</div>
			</PayPalScriptProvider>
		)
	} else {
		return (
			<>
				<PayPalScriptProvider
					options={{
						"client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
						vault: true
					}}
				>
					<Topbar />
					<main className="overflow-x-none">{children}</main>
				</PayPalScriptProvider>
			</>
		)
	}
}

const App = ({ children }) => {
	const { data: session, status } = useSession()
	const { successMessage, errorMessage, setSuccessMessage, setErrorMessage } =
		useErrorContext()

	const router = useRouter()
	return (
		<>
			<Head>
				<title>PodZ Network</title>
				<meta
					key="viewport"
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				{/* <meta
					property="og:image"
					content="https://www.Podz.com/assets/collage.8899474f.jpg"
				/> */}
			</Head>
			{(successMessage || errorMessage) && (
				<Modal
					onClose={() => {
						setSuccessMessage(null)
						setErrorMessage(null)
					}}
				>
					<div className="flex flex-col justify-center gap-5">
						<p className="text-center">
							{successMessage || errorMessage}
						</p>
						<div className="mx-auto">
							<Button
								onClick={() => {
									setSuccessMessage(null)
									setErrorMessage(null)
								}}
								variant={buttonVariants.PRIMARY}
							>
								Close
							</Button>
						</div>
					</div>
				</Modal>
			)}
			{isAuthenticated(status, session, children, router)}
		</>
	)
}

export default App
