import {
	addAdminUser,
	deleteUser,
	updateUser,
	useUsers,
	useUsersMutator
} from "@/lib/app/user"
import { useEffect } from "react"
import { useState } from "react"
import toast from "react-hot-toast"
import { Input } from "../common/Input"
import { SelectInput } from "../common/Input/SelectInput"
import { DeleteConfirmationModal } from "../common/Modal"
import Spinner from "../common/Spinner"
import Table from "../common/Table"
import { SectionHeading } from "../common/Typography"
import Image from "next/image"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import AdminGuestRequest from "./AdminGuestRequest"
import FillOwnerInfo from "./FillOwnerInfo"
import AdminOwnerRequest from "./AdminOwnerRequest"
import EditOwnerInfo from "./EditOwner"
import EditGuest from "./EditGuest"
import { useSWRConfig } from "swr"
// import UserTable from "./table"

function AddUser(props) {
	const { setShowModal, loading, setLoading, selectedUser, setSelectedUser } =
		props
	const roleOptions = [
		{ value: "owner", label: "Podcast Owner" },
		{ value: "guest", label: "Guest" },
		{ value: "editor", label: "Editor" }
	]
	// const accessLevel = [
	// 	{ value: "owner", label: "Podcast Owner" },
	// 	{ value: "host", label: "Podcast Host" },
	// 	{ value: "guest", label: "Podcast Guest" }
	// ]
	const [userData, setUserData] = useState({
		fName: "",
		lName: "",
		email: "",
		role: "",
		access: ["editor"]
	})
	const [selectedGuestUser, setSelectedGuestUser] = useState(null)
	const [selectedOwnerUser, setSelectedOwnerUser] = useState(null)
	const [showOwnerForm, setShowOwnerForm] = useState(null)
	const [role, setRole] = useState("")
	const { mutate } = useSWRConfig()

	const onSubmit = async () => {
		try {
			setLoading(true)
			if (selectedUser) {
				const updatedUser = await updateUser({
					id: selectedUser._id,
					name: userData.fName + " " + userData.lName,
					email: userData.email,
					role: userData.role,
					access: userData.access
				})
				mutate("/api/users")
				toast.success("User updated successfully.")
			} else {
				const adminUserData = {
					name: userData.fName + " " + userData.lName,
					email: userData.email,
					role: userData.role,
					access: []
				}

				if (userData.role === "guest" || userData.role === "editor") {
					adminUserData.access = userData.access
				}

				const id = await addAdminUser(adminUserData)

				mutate("/api/users")
				toast.success("User added successfully.")
				if (userData.role === "guest") {
					setSelectedGuestUser(id)
					setLoading(false)
					return
				}

				if (userData.role === "owner") {
					setSelectedOwnerUser(id)
					setLoading(false)
					return
				}
			}
			setLoading(false)
			setShowModal(false)
		} catch (e) {
			toast.error(e.message)
			setLoading(false)
		}
	}

	useEffect(() => {
		if (selectedUser) {
			setRole(
				roleOptions.filter(option => option.value === selectedUser.role)
			)
			setUserData({
				fName: selectedUser.name.split(" ")[0],
				lName: selectedUser.name.split(" ")[1],
				email: selectedUser.email,
				role: selectedUser.role,
				access: selectedUser.access
			})
		}
	}, [selectedUser])

	if (showOwnerForm) {
		return (
			<AdminOwnerRequest
				userId={selectedOwnerUser}
				setSelectedOwnerUser={setSelectedOwnerUser}
				setShowOwnerForm={setShowOwnerForm}
			/>
		)
	}

	if (selectedOwnerUser) {
		return (
			<FillOwnerInfo
				userId={selectedOwnerUser}
				setEditMode={setShowModal}
				setShowOwnerForm={setShowOwnerForm}
			/>
		)
	}

	if (selectedGuestUser) {
		return (
			<AdminGuestRequest
				setShowModal={setShowModal}
				setSelectedGuestUser={setSelectedGuestUser}
				userId={selectedGuestUser}
			/>
		)
	}

	return (
		!selectedGuestUser && (
			<div>
				<div>
					<div className="flex flex-row gap-x-2">
						<button
							onClick={() => {
								setShowModal(false)
								setSelectedUser(null)
							}}
							className="flex items-center shrink-0"
						>
							<Image
								src="/images/backArrow.svg"
								height={20}
								width={20}
								alt="Go Back"
							/>
						</button>
						<SectionHeading>Add new user</SectionHeading>
					</div>
				</div>
				<form className="flex flex-col w-full gap-5 mt-6 lg:w-1/2">
					<Input
						label="First Name"
						onChange={e =>
							setUserData({
								...userData,
								fName: e.target.value
							})
						}
						value={userData.fName}
						className="shadow-sm"
						htmlType="text"
						required={true}
						placeholder="Bonnie"
					/>
					<Input
						label="Last Name"
						value={userData.lName}
						onChange={e =>
							setUserData({
								...userData,
								lName: e.target.value
							})
						}
						className="shadow-sm"
						htmlType="text"
						required={true}
						placeholder="Green"
					/>
					<Input
						label="Email"
						value={userData.email}
						onChange={e =>
							setUserData({
								...userData,
								email: e.target.value
							})
						}
						className="shadow-sm"
						htmlType="email"
						required={true}
						placeholder="example@company.com"
					/>

					<SelectInput
						label="Role"
						value={role}
						onChange={option => {
							setUserData({
								...userData,
								role: option.value,
								access: [option.value]
							})
							setRole(
								roleOptions.filter(
									role => role.value === option.value
								)[0]
							)
						}}
						options={roleOptions}
					/>
					<div className="flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
						{(userData.access.includes("guest") ||
							userData.access.includes("owner")) && (
							<Button
								onClick={onSubmit}
								loading={loading}
								variant={buttonVariants.PRIMARY}
								className="w-full lg:max-w-[240px]"
							>
								Next
							</Button>
						)}
						{!userData.access.includes("guest") &&
							!userData.access.includes("owner") && (
								<Button
									onClick={onSubmit}
									loading={loading}
									variant={buttonVariants.PRIMARY}
									className="w-full lg:max-w-[240px]"
								>
									{selectedUser ? "Save Changes" : "Add user"}
								</Button>
							)}
						<Button
							onClick={() => {
								setSelectedUser(null)
								setShowModal(false)
							}}
							variant={buttonVariants.SECONDARY}
							className="w-full lg:max-w-[240px]"
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		)
	)
}

function UserCard({ user, editClick, deleteClick }) {
	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<h3 className="font-semibold text-primary">{user.name}</h3>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Email</h4>
				<p>{user.email}</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Role</h4>
				<p>{user.role}</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Access</h4>
				<p>
					{user.access.map((acc, index) => (
						<span key={index}>
							{acc}
							{index < user.access.length - 1 ? ", " : ""}
						</span>
					))}
				</p>
			</div>
			<div className="flex gap-x-[10px]">
				<button
					onClick={editClick}
					className="px-10 py-2 text-white bg-primary rounded-[18px]"
				>
					Edit
				</button>
				<button
					onClick={deleteClick}
					className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
				>
					Delete
				</button>
			</div>
		</div>
	)
}

function Users() {
	const [showModal, setShowModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const [selectedUserForDeletion, setSelectedUserForDeletion] = useState(null)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false)
	const { users, loading: usersLoading } = useUsers()
	const usersMutator = useUsersMutator()
	const [loading, setLoading] = useState(false)

	const handleEditClick = user => {
		setSelectedUser(user)
		setShowModal(true)
		// setShowEditModal(true)
	}

	const handleDeleteClick = user => {
		setShowDeleteConfirmationModal(true)
		setSelectedUserForDeletion(user)
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await deleteUser(selectedUserForDeletion._id)
			usersMutator.deleteUser(selectedUserForDeletion._id)
			toast.success("User deleted successfully.")
			setLoading(false)
			setShowDeleteConfirmationModal(false)
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	const verifiedUsers = users?.filter(user => user.approved)

	if (selectedUser?.role === "guest") {
		return (
			<EditGuest
				setShowModal={setShowModal}
				userId={selectedUser?._id}
				setSelectedUser={setSelectedUser}
			/>
		)
	}

	if (selectedUser?.role === "owner") {
		return (
			<EditOwnerInfo
				setShowAddModal={setShowModal}
				userId={selectedUser?._id}
				setSelectedUser={setSelectedUser}
			/>
		)
	}

	return !showModal ? (
		<>
			<section className="flex flex-col gap-5">
				<SectionHeading
					button="Add new user"
					buttonOnClick={() => setShowModal(true)}
				>
					Users
				</SectionHeading>

				{showDeleteConfirmationModal && (
					<DeleteConfirmationModal
						message="Are you sure that you want to delete this user?"
						onClose={() => setShowDeleteConfirmationModal(false)}
						onConfirm={onDelete}
						loading={loading}
					/>
				)}
				{/* {showEditModal && (
					<EditUser
						usersMutator={usersMutator}
						showModal={showEditModal}
						setShowModal={setShowEditModal}
						user={selectedUser}
						setLoading={setLoading}
						loading={loading}
					/>
				)} */}
				{/* <div className="flex justify-end">
					<button
						type="button"
						className="text-white  bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
						onClick={() => setShowModal(true)}
					>
						Add new User
					</button>
				</div> */}

				{usersLoading ? (
					<Spinner />
				) : (
					<>
						{verifiedUsers?.length > 0 ? (
							<>
								<Table
									className="hidden lg:block"
									headers={[
										"name",
										"email",
										"role",
										"access"
									]}
									fields={["name", "email", "role", "access"]}
									buttons={[
										{
											icon: (
												<Image
													src="/images/edit.svg"
													height={16}
													width={16}
													alt="Edit Episode"
												/>
											)
										},
										{
											icon: (
												<Image
													src="/images/delete.svg"
													height={16}
													width={16}
													alt="Edit Episode"
												/>
											)
										}
									]}
									buttonFunctions={[
										handleEditClick,
										handleDeleteClick
									]}
									data={verifiedUsers}
								/>
								<div className="flex flex-col gap-5 lg:hidden">
									{verifiedUsers?.map((user, index) => (
										<UserCard
											user={user}
											key={user._id}
											editClick={() =>
												handleEditClick(user)
											}
											deleteClick={() =>
												handleDeleteClick(user)
											}
										/>
									))}
								</div>
							</>
						) : (
							<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
								Currenly, there are no users to show.
							</div>
						)}
					</>
				)}
			</section>
		</>
	) : (
		<AddUser
			showModal={showModal}
			setShowModal={setShowModal}
			setLoading={setLoading}
			loading={loading}
			selectedUser={selectedUser}
			setSelectedUser={setSelectedUser}
		/>
	)
}

export default Users
