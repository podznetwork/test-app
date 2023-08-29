import { Button } from "@/components/common/Button"
import { Input } from "@/components/common/Input"
import { Container, Spacer } from "@/components/Layout"
import { fetcher } from "@/lib/app/fetch"
import { useCallback, useRef, useState } from "react"
import toast from "react-hot-toast"
import styles from "./Settings.module.css"
import { SectionHeading } from "../common/Typography"
import { ToggleButton } from "../common/ToggleButton"
import { buttonVariants } from "../common/Button/Button"
import { editUserData, useCurrentUser, useUserMutator } from "@/lib/app/user"

const EmailVerify = ({ user }) => {
	const [status, setStatus] = useState()
	const verify = useCallback(async () => {
		try {
			setStatus("loading")
			await fetcher("/api/user/email/verify", { method: "POST" })
			toast.success(
				"An email has been sent to your mailbox. Follow the instruction to verify your email."
			)
			setStatus("success")
		} catch (e) {
			toast.error(e.message)
			setStatus("")
		}
	}, [])
	if (user.emailVerified) return null
	return (
		<Container className={styles.note}>
			<Spacer size={1} axis="horizontal" />
			<Button
				loading={status === "loading"}
				size="small"
				onClick={verify}
				disabled={status === "success"}
			>
				Verify
			</Button>
		</Container>
	)
}

const Auth = () => {
	const oldPasswordRef = useRef()
	const newPasswordRef = useRef()

	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = useCallback(async e => {
		e.preventDefault()
		try {
			setIsLoading(true)
			await fetcher("/api/user/password", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					oldPassword: oldPasswordRef.current.value,
					newPassword: newPasswordRef.current.value
				})
			})
			toast.success("Your password has been updated")
		} catch (e) {
			toast.error(e.message)
		} finally {
			setIsLoading(false)
			oldPasswordRef.current.value = ""
			newPasswordRef.current.value = ""
		}
	}, [])

	return (
		<section className={styles.card}>
			<h4 className={styles.sectionTitle}>Password</h4>
			<form onSubmit={onSubmit}>
				<Input
					htmlType="password"
					autoComplete="current-password"
					ref={oldPasswordRef}
					label="Old Password"
				/>
				<Spacer size={0.5} axis="vertical" />
				<Input
					htmlType="password"
					autoComplete="new-password"
					ref={newPasswordRef}
					label="New Password"
				/>
				<Spacer size={0.5} axis="vertical" />
				<Button
					htmlType="submit"
					className={styles.submit}
					type="success"
					loading={isLoading}
				>
					Save
				</Button>
			</form>
		</section>
	)
}

export const Settings = () => {
	const { user } = useCurrentUser()
	const newPasswordRef = useRef()
	const oldPasswordRef = useRef()
	const userMutator = useUserMutator()

	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = useCallback(async e => {
		e.preventDefault()
		try {
			setIsLoading(true)
			await fetcher("/api/user/password", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					newPassword: newPasswordRef.current.value,
					oldPassword: oldPasswordRef.current.value
				})
			})
			toast.success("Your password has been updated")
		} catch (e) {
			toast.error(e.message)
		} finally {
			setIsLoading(false)
			newPasswordRef.current.value = ""
			oldPasswordRef.current.value = ""
		}
	}, [])

	return (
		<>
			<div className="flex flex-col gap-y-4">
				<SectionHeading>Settings</SectionHeading>
				<div className="flex flex-col gap-y-1">
					<ToggleButton
						checked={!!user?.allowMessages}
						onChange={async e => {
							try {
								await editUserData(user._id, {
									allowMessages: e.target.checked
								})
								userMutator.updateUser({
									...user,
									allowMessages: !e.target.checked
								})
							} catch (e) {
								console.log(e)
							}
						}}
						label="Allow users to send me messages"
					/>
					<ToggleButton
						checked={!!user?.seeFavz}
						onChange={async e => {
							try {
								await editUserData(user._id, {
									seeFavz: e.target.checked
								})
								userMutator.updateUser({
									...user,
									seeFavz: !e.target.checked
								})
							} catch (e) {
								console.log(e)
							}
						}}
						label="Allow users to see My FAVZ"
					/>
					<ToggleButton
						checked={!!user?.becomeHost}
						onChange={async e => {
							try {
								await editUserData(user._id, {
									becomeHost: e.target.checked
								})
								userMutator.updateUser({
									...user,
									becomeHost: !e.target.checked
								})
							} catch (e) {
								console.log(e)
							}
						}}
						label="Allow Podcast owners to send host requests to you"
					/>
					<ToggleButton
						checked={!!user?.allowGuestRequests}
						onChange={async e => {
							try {
								await editUserData(user._id, {
									allowGuestRequests: e.target.checked
								})
								userMutator.updateUser({
									...user,
									allowGuestRequests: !e.target.checked
								})
							} catch (e) {
								console.log(e)
							}
						}}
						label="Allow Podcast owners to invite you as a guest"
					/>
				</div>
				<form
					onSubmit={onSubmit}
					className="flex flex-col w-full gap-y-4 lg:w-1/3"
				>
					<SectionHeading>Credentials</SectionHeading>
					<Input
						value={user?.email}
						htmlType="email"
						disabled
						label="Email"
						placeholder="email@email.com"
					/>
					<div className="flex items-end gap-x-3">
						<Input
							className="basis-1/2"
							ref={oldPasswordRef}
							htmlType="password"
							label="Old Password"
							placeholder="*******"
						/>
						<Input
							className="basis-1/2"
							ref={newPasswordRef}
							htmlType="password"
							label="New Password"
							placeholder="*******"
						/>
					</div>
					<Button
						className="basis-1/2 h-[50px]"
						variant={buttonVariants.SECONDARY}
						loading={isLoading}
					>
						Change
					</Button>
				</form>
			</div>
		</>
		// <Wrapper className={styles.wrapper}>
		// 	<Spacer size={2} axis="vertical" />
		// 	{/* <EmailVerify user={session.user} /> */}
		// 	<Auth user={session.user} />
		// </Wrapper>
	)
}
