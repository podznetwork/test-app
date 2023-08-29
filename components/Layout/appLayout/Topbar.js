import { Avatar } from "@/components/common/Avatar"
import { Button, ButtonLink } from "@/components/common/Button"
import Spinner from "@/components/common/Spinner"
import CustomImage from "@/components/CustomImage/CustomImage"
import { useAllPodcasts } from "@/lib/app/podcast"
import { useCurrentUser } from "@/lib/app/user"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Wrapper } from ".."
import styles from "./Topbar.module.css"
import { buttonVariants } from "@/components/common/Button/Button"
const ShowsMenu = ({ podcasts, loading }) => {
	const router = useRouter()

	return (
		<ul className="flex flex-row justify-center gap-6 m-8">
			{loading ? (
				<Spinner />
			) : (
				podcasts?.map(podcast => (
					<li
						className="rounded-lg shadow-lg hover:cursor-pointer"
						key={podcast.id}
						onClick={() => {
							router.push(`/shows/${podcast.uId}`)
						}}
					>
						<CustomImage
							className="rounded-sm"
							src={
								podcast
									? podcast.logoPath
									: "/content-gallery-3.png"
							}
							width={300}
							alt="Podcast Image from source"
						/>

						<p className="flex items-center justify-center font-bold hover:underline hover:text-primary-600 dark:hover:text-primary-500">
							{podcast.name}
						</p>
					</li>
				))
			)}
			<li className="flex items-center justify-center rounded-lg">
				<Link href={"/shows"}>
					<a className="hover:underline hover:text-primary-600 dark:hover:text-primary-500">
						View All Shows
					</a>
				</Link>
			</li>
		</ul>
		// </div>
	)
}

export const UserMenu = () => {
	const { user } = useCurrentUser()
	const menuRef = useRef()
	const avatarRef = useRef()

	const [visible, setVisible] = useState(false)

	// const router = useRouter()
	// useEffect(() => {
	// 	const onRouteChangeComplete = () => setVisible(false)
	// 	router.events.on("routeChangeComplete", onRouteChangeComplete)
	// 	return () =>
	// 		router.events.off("routeChangeComplete", onRouteChangeComplete)
	// })

	useEffect(() => {
		// detect outside click to close menu
		const onMouseDown = event => {
			if (
				!menuRef.current.contains(event.target) &&
				!avatarRef.current.contains(event.target)
			) {
				setVisible(false)
			}
		}
		document.addEventListener("mousedown", onMouseDown)
		return () => {
			document.removeEventListener("mousedown", onMouseDown)
		}
	}, [])

	const onSignOut = useCallback(async () => {
		try {
			await signOut()
			toast.success("You have been signed out")
		} catch (e) {
			toast.error(e.message)
		}
	}, [])

	return (
		<div className={styles.user}>
			<button
				className={styles.trigger}
				ref={avatarRef}
				onClick={() => setVisible(!visible)}
			>
				<Avatar
					size={32}
					username={user?.username}
					url={user?.profilePicture}
				/>
			</button>
			<div
				ref={menuRef}
				role="menu"
				aria-hidden={visible}
				className={styles.popover + " left-0 lg:right-0 lg:left-auto"}
			>
				{visible && (
					<div className={styles.menu}>
						{user?.role === "admin" ? (
							<Link href={`/dashboard`}>
								<a className={styles.item}>Dashboard</a>
							</Link>
						) : (
							<>
								<Link href={`/mypodcasts`}>
									<a className={styles.item}>Dashboard</a>
								</Link>
								<Link href={`/profile`}>
									<a className={styles.item}>Profile</a>
								</Link>
							</>
						)}
						<Link href="/settings">
							<a className={styles.item}>Settings</a>
						</Link>
						<button onClick={onSignOut} className={styles.item}>
							Sign out
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

const Topbar = () => {
	const { data: session } = useSession()
	const [showMenu, setShowMenu] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const [showPeopleMenu, setShowPeopleMenu] = useState(false)
	const { podcasts, loading: podcastsLoading } = useAllPodcasts(null, 5)

	const openMenu = () => {
		setShowMenu(true)
	}

	const closeMenu = () => {
		setShowMenu(false)
	}

	const menuRef = useRef()

	return (
		<Wrapper className="sticky top-0 left-0 right-0 z-50">
			<nav className="z-40 bg-[#FEF9F9] border-gray-200 py-2.5 dark:bg-gray-900">
				<div className="relative flex flex-wrap items-center justify-between mx-auto">
					<Link
						href="/"
						className="flex items-center cursor-pointer"
						passHref
					>
						<div className="static cursor-pointer lg:absolute">
							<img
								src="/logo.png"
								className="z-50 h-16 mr-3 left-5 lg:h-32"
								alt="Podznetwork Logo"
							/>
						</div>
					</Link>
					<div className="grow"></div>
					<button
						data-collapse-toggle="navbar-default"
						type="button"
						className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						aria-controls="navbar-default"
						aria-expanded="false"
						onClick={() => {
							menuOpen
								? menuRef.current.classList.add("hidden")
								: menuRef.current.classList.remove("hidden")
							setMenuOpen(!menuOpen)
						}}
					>
						<span className="sr-only">Open main menu</span>
						<svg
							className="w-6 h-6"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clipRule="evenodd"
							></path>
						</svg>
					</button>
					<div
						ref={menuRef}
						className="hidden w-full lg:block lg:w-auto"
						id="navbar-default"
					>
						<ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 lg:flex-row lg:space-x-8 lg:mt-0 lg:text-sm lg:font-medium lg:border-0 lg:bg-[#FEF9F9] dark:bg-gray-800 lg:dark:bg-gray-900 dark:border-gray-700">
							<li
								className="pt-1"
								onMouseEnter={() => setShowMenu(true)}
								onMouseLeave={() => setShowMenu(false)}
							>
								<button
									id="mega-menu-full-cta-image-button"
									data-collapse-toggle="mega-menu-full-image-dropdown"
									className="flex items-center justify-between hidden w-full pl-0 font-medium text-gray-700 border-b border-gray-100 lg:flex lg:pl-3 lg:w-auto hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary lg:p-0"
									onMouseOver={openMenu}
									onMouseLeave={closeMenu}
								>
									Shows{" "}
									<svg
										className="w-4 h-4 ml-1"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										></path>
									</svg>
									{showMenu ? (
										<div className="absolute left-0 right-0 z-40 mt-1 bg-white border-gray-200 shadow-lg top-8">
											<ShowsMenu
												loading={podcastsLoading}
												podcasts={podcasts}
											/>
										</div>
									) : null}
								</button>
								<button className="lg:hidden">
									<Link href="/shows">Shows</Link>
								</button>
							</li>
							<li
								onMouseOver={() => setShowPeopleMenu(true)}
								onMouseLeave={() => setShowPeopleMenu(false)}
								className="relative z-50 pt-1"
							>
								<div className="flex items-center justify-between w-full hover:text-primary">
									<Link
										href="/people/hosts"
										className="z-50 block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:p-0 hover:text-primary"
									>
										People
									</Link>
									<svg
										className="w-4 h-4 ml-1"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										></path>
									</svg>
								</div>

								{showPeopleMenu && (
									<div className="flex justify-center top-[-5px] flex-row lg:flex-col shadow-md absolute z-[60] bg-white lg:top-8 left-[200px] lg:left-[50%] -translate-x-[50%] mx-auto w-[200px] lg:w-[150px]">
										<Link passHref href="/people/hosts">
											<div className="p-2 cursor-pointer hover:bg-primary hover:text-white">
												Hosts
											</div>
										</Link>
										<Link passHref href="/people/guests">
											<div className="p-2 cursor-pointer hover:bg-primary hover:text-white">
												Guests
											</div>
										</Link>
										<Link passHref href="/people/crew">
											<div className="p-2 cursor-pointer hover:bg-primary hover:text-white">
												Crew
											</div>
										</Link>
									</div>
								)}
							</li>
							<li className="z-50 pt-1">
								<Link
									passHref
									href="/about"
									className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent"
								>
									<span className="cursor-pointer hover:text-primary">
										About
									</span>
								</Link>
							</li>
							<li className="z-50 pt-1">
								<Link
									passHref
									href="/pricing"
									className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent"
								>
									<span className="cursor-pointer hover:text-primary">
										Pricing
									</span>
								</Link>
							</li>
							<li className="z-50 pt-1">
								<Link
									passHref
									href="/advertise"
									className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent"
								>
									<span className="cursor-pointer hover:text-primary">
										Advertise
									</span>
								</Link>
							</li>
							<li className="z-50 pt-1">
								<Link
									passHref
									href="/contact"
									className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent"
								>
									<span className="cursor-pointer hover:text-primary">
										Contact
									</span>
								</Link>
							</li>

							{session ? (
								<div className="mt-2 lg:mt-0">
									<UserMenu user={session.user} />
								</div>
							) : (
								<div className="flex flex-col gap-2 lg:flex-row">
									<li className="z-30">
										<Link passHref href="/login">
											<ButtonLink
												className="flex justify-center items-center min-w-[100px]"
												size="small"
												type="success"
												variant={
													buttonVariants.SECONDARY
												}
												color="link"
											>
												Log in
											</ButtonLink>
										</Link>
									</li>
									<li className="z-30">
										<Link passHref href="/register">
											<ButtonLink
												variant={buttonVariants.PRIMARY}
												size="small"
												type="success"
												className="flex items-center justify-center min-w-[100px]"
											>
												Sign Up
											</ButtonLink>
										</Link>
									</li>
								</div>
							)}
						</ul>
					</div>
				</div>
			</nav>
		</Wrapper>
	)
}

export default Topbar
