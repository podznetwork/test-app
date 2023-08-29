import { useUsers } from "@/lib/app/user"
import Link from "next/link"
import Spinner from "../common/Spinner"
import { Wrapper } from "../Layout"

const List = function ({ user }) {
	return (
		<Link href={`/profile/${user._id}`}>
			<div className="w-full max-w-xs mb-2 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-200 dark:bg-gray-800 dark:border-gray-700">
				<div className="flex flex-col items-center p-8">
					<img
						className="w-32 mb-3 rounded-full shadow-lg"
						src={user.profilePicture ?? "/images/default_user.jpg"}
						alt="Bonnie image"
					/>
					<h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
						<Link href={`/profile/${user._id}`}>{user.name}</Link>
					</h5>
				</div>
			</div>
		</Link>
	)
}
function People({ type }) {
	const userTitles = {
		host: "Hosts",
		guest: "Guests",
		editor: "Crew"
	}

	const { users, loading: usersLoading } = useUsers(type)

	return (
		<Wrapper>
			<div className="min-h-screen mt-8">
				<div className="mb-6 ">
					<h2 className="text-4xl font-extrabold dark:text-white">
						{userTitles[type]}
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
					{usersLoading ? (
						<Spinner />
					) : users?.length != 0 ? (
						users?.map(user => <List key={user._id} user={user} />)
					) : (
						<div className="min-h-screen">
							<p>No users found</p>
						</div>
					)}
				</div>
			</div>
		</Wrapper>
	)
}
export default People
