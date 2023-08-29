import { Button } from "@/components/common/Button"
import { ButtonLink } from "@/components/common/Button/Button"
import { Input } from "@/components/common/Input"
import { Text } from "@/components/common/Text"
import { Spacer, Wrapper } from "@/components/Layout"
import { fetcher } from "@/lib/app/fetch"
import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import styles from "./ForgetPassword.module.css"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

const ForgetPasswordIndex = () => {
	const { setErrorMessage } = useErrorContext()
	const emailRef = useRef()
	// 'loading' || 'success'
	const [status, setStatus] = useState()
	const [email, setEmail] = useState("")
	const onSubmit = useCallback(async e => {
		e.preventDefault()
		try {
			setStatus("loading")
			await fetcher("/api/user/password/reset", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: emailRef.current.value
				})
			})
			setEmail(emailRef.current.value)
			setStatus("success")
		} catch (e) {
			setErrorMessage(e.message)
			setStatus(undefined)
		}
	}, [])

	return (
		<Wrapper className={styles.root}>
			<div className={styles.main}>
				{status === "success" ? (
					<>
						<h1 className={styles.title}>Check your inbox</h1>
						<p className={styles.subtitle}>
							An email has been sent{" "}
							<Text as="span" color="link">
								{email}
							</Text>
							. Please follow the link in that email to reset your
							password.
						</p>
					</>
				) : (
					<>
						<h1 className={styles.title}>Forgot password?</h1>
						<p className={styles.subtitle}>
							Enter the email address associated with your
							account, and we&apos;ll send you a link to reset
							your password.
						</p>
						<Spacer size={1} />
						<form onSubmit={onSubmit}>
							<Input
								ref={emailRef}
								htmlType="email"
								autoComplete="email"
								placeholder="Email Address"
								ariaLabel="Email Address"
								size="large"
								required
							/>
							<Spacer size={0.5} axis="vertical" />
							<Button
								htmlType="submit"
								className={styles.submit}
								type="success"
								size="large"
								loading={status === "loading"}
							>
								Continue
							</Button>
						</form>
					</>
				)}
				<Spacer size={0.25} axis="vertical" />
				<Link href="/login" passHref>
					<ButtonLink type="success" size="large" variant="ghost">
						Return to login
					</ButtonLink>
				</Link>
			</div>
		</Wrapper>
	)
}

export default ForgetPasswordIndex
