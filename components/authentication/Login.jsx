import { Button } from "@/components/common/Button"
import { ButtonLink } from "@/components/common/Button/Button"
import { Input } from "@/components/common/Input"
import { TextLink } from "@/components/common/Text"
import { Spacer, Wrapper } from "@/components/Layout"
import { signin } from "@/lib/app/user"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./Auth.module.css"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

const Login = () => {
	const { setErrorMessage } = useErrorContext()
	const emailRef = useRef()
	const passwordRef = useRef()

	const router = useRouter()

	const [loading, setLoading] = useState(false)
	const { status } = useSession()

	const handleGoogleSignIn = async event => {
		event.preventDefault()
		try {
			await signIn("google")
		} catch (e) {
			setErrorMessage(e.message)
		}
	}

	const onSubmit = useCallback(async event => {
		setLoading(true)
		event.preventDefault()
		try {
			const response = await signin({
				email: emailRef.current.value,
				password: passwordRef.current.value,
				redirect: false
			})
			if (!response.ok) {
				throw new Error(response.error?.toString())
			}
		} catch (e) {
			setErrorMessage(e?.toString())
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		if (status === "authenticated") router.replace("/mypodcasts")
	}, [status, router])

	return (
		<Wrapper className={styles.root}>
			<div className={styles.main}>
				<div className="mb-5">
					<h1 className={styles.title}>Login to App</h1>
				</div>
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
					<Input
						ref={passwordRef}
						htmlType="password"
						autoComplete="current-password"
						placeholder="Password"
						ariaLabel="Password"
						size="large"
						required
					/>
					<Spacer size={0.5} axis="vertical" />
					<Button
						htmlType="submit"
						className={styles.submit}
						type="success"
						size="large"
						loading={loading}
					>
						Log in
					</Button>
					<Button
						htmlType="button"
						onClick={handleGoogleSignIn}
						className="w-full mt-4 "
						type="success"
						size="large"
						loading={loading}
					>
						Sign In With Google
					</Button>
					<Spacer size={0.25} axis="vertical" />
					<Link href="/forget-password" passHref>
						<ButtonLink type="success" size="large" variant="ghost">
							Forgot password?
						</ButtonLink>
					</Link>
				</form>
			</div>
			<div className={styles.footer}>
				<Link href="/register" passHref>
					<TextLink color="link" variant="highlight">
						Don&apos;t have an account? Sign Up
					</TextLink>
				</Link>
			</div>
		</Wrapper>
	)
}

export default Login
