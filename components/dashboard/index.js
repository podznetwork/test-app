import { useUserCount } from "@/lib/app/user"
import Image from "next/image"
import Spinner from "../common/Spinner"

function Dashboard() {
	const { userCount: ownerCount, loading: ownerCountLoading } =
		useUserCount("owner")
	const { userCount, loading: userCountLoading } = useUserCount("user")
	const { userCount: guestCount, loading: guestCountLoading } =
		useUserCount("guest")
	const { userCount: hostCount, loading: hostCountLoading } =
		useUserCount("host")

	return (
		<div className="">
			<div className="grid gap-5 gird-cols-1 md:grid-cols-2">
				<article className=" flex items-center gap-[10px] rounded-[14px] border border-gray-100 bg-white p-6">
					<span className="p-3 rounded-full text-primary-600">
						<Image
							src="/user.JPG"
							className="w-8 h-8"
							alt="User Badge"
							width={70}
							height={70}
						/>
					</span>

					{userCountLoading ? (
						<div>
							<Spinner />
						</div>
					) : (
						<div>
							<p className="text-lg font-medium text-black">
								{userCount}
							</p>

							<p className="text-xs text-[#4B5563]">
								Total Users
							</p>
						</div>
					)}
				</article>
				<article className="flex items-center gap-[10px] p-6 bg-white border border-gray-100 rounded-[14px] ">
					<span className="p-3 rounded-full text-primary-600">
						<Image
							src="/host.JPG"
							className="w-8 h-8"
							alt="User Badge"
							width={80}
							height={70}
						/>
					</span>

					{hostCountLoading ? (
						<div>
							<Spinner />
						</div>
					) : (
						<div>
							<p className="text-lg font-medium text-black">
								{hostCount}
							</p>

							<p className="text-xs text-[#4B5563]">
								Total Hosts
							</p>
						</div>
					)}
				</article>
				<article className="flex items-center gap-[10px] p-6 bg-white border border-gray-100 rounded-[14px] ">
					<span className="p-3 rounded-full text-primary-600">
						<Image
							src="/guest.JPG"
							className="w-8 h-8"
							alt="User Badge"
							width={70}
							height={70}
						/>
					</span>

					{guestCountLoading ? (
						<div>
							<Spinner />
						</div>
					) : (
						<div>
							<p className="text-lg font-medium text-black">
								{guestCount}
							</p>

							<p className="text-xs text-[#4B5563]">
								Total Guests
							</p>
						</div>
					)}
				</article>
				<article className="flex items-center gap-3 p-6 bg-white border border-gray-100 rounded-lg ">
					<span className="p-3 rounded-full text-primary-600">
						<Image
							src="/podcaster.JPG"
							className="w-8 h-8"
							alt="User Badge"
							width={70}
							height={70}
						/>
					</span>

					{ownerCountLoading ? (
						<div>
							<Spinner />
						</div>
					) : (
						<div>
							<p className="text-lg font-medium text-black">
								{ownerCount}
							</p>

							<p className="text-xs text-[#4B5563]">
								Total Owners
							</p>
						</div>
					)}
				</article>
			</div>
		</div>
	)
}

export default Dashboard
