import Access from "@/components/auth-checkers/Access"
import Authentication from "@/components/auth-checkers/Authentication"
import Guest from "@/components/auth-checkers/Guest"
import ErrorContextProvider from "@/components/ContextProviders/ErrorContextProvider"
import { App } from "@/components/Layout"
import "@/styles/global.css"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps }
}) {
	function withRouteProtectors(children) {
		// console.log(Component.routeProtector)
		switch (Component.routeProtector) {
			case "AUTH":
				return <Authentication>{children}</Authentication>
			case "GUEST":
				return <Guest>{children}</Guest>
			default:
				return (
					<Access access={Component.routeProtector}>
						{children}
					</Access>
				)
		}
	}

	return (
		<ErrorContextProvider>
			<SessionProvider session={session}>
				{withRouteProtectors(
					<App>
						<Component {...pageProps} />
						<Toaster />
					</App>
				)}
			</SessionProvider>
		</ErrorContextProvider>
	)
}
