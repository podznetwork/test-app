import { useUsers } from "@/lib/app/user"
import React, { useState } from "react"
import { Input } from "../common/Input"
import Table from "../common/Table"
import { fuzzySearch } from "@/lib/app/utils"

function ChooseUserView({ setSelectedUser }) {
	const { users } = useUsers()
	const [searchTerm, setSearchTerm] = useState("")
	const options = {
		includeScore: false,
		threshold: 0.2,
		keys: ["name"]
	}
	const filteredUsers = fuzzySearch(users, searchTerm, options)

	return (
		<div className="flex flex-col gap-5">
			<div>
				<Input
					placeholder="Search user by name"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</div>
			<Table
				headers={["name", "email", "access"]}
				fields={["name", "email", "access"]}
				onRowClick={user => setSelectedUser(user)}
				data={filteredUsers}
			/>
		</div>
	)
}

function AddAdminPodcast() {
	const [selectedUser, setSelectedUser] = useState(null)

	return !selectedUser ? (
		<ChooseUserView setSelectedUser={setSelectedUser} />
	) : (
		<div></div>
	)
}

export default AddAdminPodcast
