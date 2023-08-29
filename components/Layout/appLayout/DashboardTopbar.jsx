import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
import { useCurrentUser } from "@/lib/app/user"
import Image from "next/image"
import styles from "./Wrapper.module.css"
import clsx from "clsx"
import { useRouter } from "next/router"
import { UserMenu } from "./Topbar"

const DashboardTopbar = () => {
	const { user } = useCurrentUser()
	const router = useRouter()

	return (
		<div
			className={clsx(
				styles.wrapper,
				"flex items-center justify-end gap-x-4 mt-6 hidden lg:flex"
			)}
		>
			{!user?.access.includes("admin") && (
				<Button
					onClick={() => {
						if (!user.access.includes("owner"))
							return router.push("/requests/access")
						router.push("/podcasts?add=true")
					}}
					variant={buttonVariants.PRIMARY}
					className={
						"flex items-center justify-center w-full lg:w-auto"
					}
				>
					<Image
						src="/images/diamond.svg"
						alt="Diamond"
						height={24}
						width={24}
					/>
					<span className="ml-2">Add your PODZ</span>
				</Button>
			)}
			<div className="flex items-center">
				<Image
					className="lg:hidden"
					height={24}
					width={24}
					src="/images/notification_bell.svg"
					alt="Notification icon"
				/>
			</div>
			{!user?.access.includes("admin") && (
				<div className="flex items-center">
					<UserMenu />
				</div>
			)}
		</div>
	)
}

export default DashboardTopbar
