import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useRef, useState } from "react"
import toast from "react-hot-toast"
import { CommonSidebar } from "./utils"
import clsx from "clsx"
import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
const Sidebar = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const menuRef = useRef()
	const logoutContainerRef = useRef()
	const badgeContainerRef = useRef()
	const [open, setOpen] = useState(true)

	function checkRole() {
		return CommonSidebar(
			session.user.role,
			session.user.access,
			session.user.id,
			[badgeContainerRef, menuRef, logoutContainerRef]
		)
	}
	function getBadge(access, index) {
		let badgeName = null
		if (access === "user") {
			badgeName = "user"
		}
		if (access === "host") {
			badgeName = "host"
		}
		if (access === "owner") {
			badgeName = "podcaster"
		}
		if (access === "guest") {
			badgeName = "guest"
		}
		return (
			badgeName && (
				<Image
					alt={`${badgeName} badge`}
					src={`/images/${badgeName}.svg`}
					className="inline-block rounded-full"
					width={40}
					height={40}
					key={index}
				/>
			)
		)
	}

	const onSignOut = useCallback(async () => {
		try {
			await signOut()
			toast.success("You have been signed out")
			router.push("/")
		} catch (e) {
			toast.error(e.message)
		}
	}, [])

	return (
		<div
			className={`flex flex-col lg:min-h-screen h-full md:py-4 lg:bg-[#FFF6F6] bg-[#fef9f9] rounded dark:bg-gray-800 ${
				open ? "w-full lg:w-72" : "lg:w-20"
			} duration-300 lg:sticky top-0 bottom-0`}
		>
			{/* <BsArrowLeftShort
				className={`hidden lg:block bg-[#FFF6F6] dark:bg-gray-800 rounded-full h-8 w-8 absolute top-9 -right-3 border border-dark-purple cursor-pointer ${
					!open && "rotate-180"
				}`}
				onClick={() => setOpen(!open)}
			/> */}

			<div className="w-full overflow-x-hidden overflow-y-auto md:py-4 dark:bg-gray-800 md:w-auto">
				<div className="grid justify-center grid-cols-3 lg:grid-cols-1">
					<button
						data-collapse-toggle="navbar-default"
						type="button"
						className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg justify-self-start lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						aria-controls="navbar-default"
						aria-expanded="false"
						onClick={() => {
							menuRef.current.classList.toggle("hidden")
							logoutContainerRef.current.classList.toggle(
								"hidden"
							)
							badgeContainerRef.current.classList.toggle("hidden")
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
					<Link className="justify-self-center" href="/">
						<a className="md:pl-2.5 md:mb-5 flex justify-center">
							<img
								src={open ? "/logo.png" : "/favicon.ico"}
								className={clsx(
									"w-20 md:w-auto",
									open
										? "md:mr-3 h-26 md:h-20"
										: "md:mr-3 h-6 md:h-4"
								)}
								alt="PodzNetwork Logo"
							/>
						</a>
					</Link>
					<Button
						onClick={() => router.push("/podcasts?add=true")}
						className="flex lg:hidden"
						style={{
							alignSelf: "center",
							justifySelf: "end",
							borderRadius: "100%",
							padding: 0,
							width: "38px",
							height: "38px",
							alignItems: "center",
							justifyContent: "center",
							marginRight: "10px"
						}}
						variant={buttonVariants.PRIMARY}
					>
						<Image
							src="/images/diamond.svg"
							alt="Diamond"
							height={24}
							width={24}
						/>
					</Button>
				</div>
				<ul ref={menuRef} className="hidden lg:block">
					{checkRole()}
				</ul>
			</div>
			<div
				ref={badgeContainerRef}
				className="order-3 hidden px-3 mt-2 gap-x-2 md:order-2 lg:flex"
			>
				{session.user.access?.map((access, index) => {
					return getBadge(access, index)
				})}
			</div>
			<div
				ref={logoutContainerRef}
				className="order-2 hidden py-2 mt-auto overflow-x-hidden border-b md:order-3 lg:block justify-self-end border-primary-100 md:border-b-0 "
			>
				<a className="flex items-center p-6 text-base font-normal text-black cursor-pointer dark:text-white hover:bg-primary-50 dark:hover:bg-gray-700">
					<svg
						className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
					>
						<rect width="22" height="22" fill="url(#pattern0)" />
						<defs>
							<pattern
								id="pattern0"
								patternContentUnits="objectBoundingBox"
								width="1"
								height="1"
							>
								<use
									xlinkHref="#image0_418_51"
									transform="scale(0.01)"
								/>
							</pattern>
							<image
								id="image0_418_51"
								width="100"
								height="100"
								xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFeElEQVR4nO2dXYxdUxTHfx1m1AllvKkgPkIF8UDjq00M4quJdNq06rPTPqgYNTwJQSciES9ClcaDjw5vLRPxRhs84EEkNJQ2bT34pj5CWx81vbJiTRw3c/Y5d+659+517vol+2WSOWed879777X3WnsdcBzHcRzHcRzHcRzHcRynVcwC5gKLgSHgDuAebbcBy4CrgQuAo12GcukD5gNrgM3A10CtwbYbeEWvcTnQ6yI1LsIgMA7snYYAee0nYEzvkbg42ZwErAX2tECErPYL8ChwnAvzH2cAG4ADbRSivv0JvACc2c3CyIT7BPB3B4Wo1bUJ4BngKLqIGcBy4LsmX95vwC7gI+Bd4D3gU5349zd5bbnGDXQB/TpZN/qCftT/uxMYAGYXuNdsdX/vBTYCP0/jvq+pzZXkfODzBl7GHmAdcCHQU8L9xd29AlgPfN+AHTuBc6gYy3TiLPICtupwIe5vq5gJ3ApsL2jTPuBGKsJqnSzzHnobcK3OMe2iR1f8uwrYd1CHTNM8WOBB9+q2R28H7TwceAj4o4AoIxjuGXlivA+cQjycDnxYwO67MThn5A1TsgY5jPhIgBcL9JTrMORNhSZwEep24mck50clQ+3ZRE5/jmsrQi3FDitzRNkZ8zplRs6ib8KYGJMMBUSRv99MpCzPGXctDFOh4av+eb7QXYMo6c/Zm5IJ3DpjqeeRrZhjiJj1Oa5tjN7UdNYqbwErMBDPmAh4IjGtM7qCdFeub7ICd9ocds2K9G2vyFBlirWB3iEbhVVgoWa+RI9sj/+QIcYnJcUwOs0C3XDcF7OLO8lgoHdUIfw5CPxVFzKOuqeMByJ9rQwudUKM6EXpCySxPYVtBjLEiFqU+QGDJQZumQR4M2cbKDpR1gSyQ6owmSfAlhxRoproN2cYKUnNVSGx1FOystDNJwFYFGVWwLhLqB5J7MPX3IBhx1JNkphFWZxh0K8l5lT1AydH1s7SHYjohq+hwEmlshjNefCYW9tFycq3kiz0shiN4MU202TRPI82cV+GEe+UeI/RCF5qGaezzqUNuCDEJcjqQNZ6WYxG8As3M2T5pE5ck/qigCHu9tJ+tze0MCxy1MwiScwLwyM1+3sqo6LZ/ewWMSb5KsMws4dZLG8uCm9kGCdh3aqQWBEjdFRNjh4fgn0SC8NUmnkBQy/CNomlnlEkyeFpbDNgMckBDddmxdU9DahDKZZZv6IqHLIftJYoF0ol3VaR7JMFllJJ85KtpQdVgYWx94w0JwQmwB1+HKEzbAj0EimN5LSZOYGqcDL2ntpug5x/E6xrgVi7HJi0zkzgbSv7dVI/8duAKFKIzDpjlo5FC7fkbDdIBWqr3GWtcAAaLXw5IMiEpQo6KVZYLa0xOXTtzik+Y0mUlZaLz6RDvKHKbBOauRI7I1UozzTJ0gIFzNZFeo49AV7KsV1C2EswxnDOQ0n7ILJ1yhx10/PEMOH6TsX9BUTZp9mQfR20U9ZJDxcsgmn+UNJwwTKxn+mWd08HysSGHJG0GJZd9/+xpMCvr6btY42n9LW4R6zSDdAiNskEfj0V47yCBYtrqcijhIMvLilxQgS+Sr9+kBXHmartsORNNYp8BmJTAy+jlspmeVVXzJcBxxe4l3yk5RqdnzZpNnqj9x3vlk9X3AR8M40XVEu1/Tr2b637XIVc9/cmr/2l0YKdTSG/vCcj+6DLAeAxTZftWk4DnstJvam1uInD8ayWK3SUE4HHG5xwm20yNz1S4ePcpdCr1eg2aupN2SJI+ajn9R5VCJy1lUM1NVVW/K9rDKKRl39QXW3xsh4ALtVrOiVyhB6mXKTVtIdTn15dpdv7V+qus5QBcRzHcRzHcRzHcRzHcRyH8vkHOzQNkPEV+k8AAAAASUVORK5CYII="
							/>
						</defs>
					</svg>
					<span
						onClick={onSignOut}
						className="flex-1 ml-3 whitespace-nowrap"
					>
						Logout
					</span>
				</a>
			</div>
		</div>
	)
}

export default Sidebar
