import { fetcher } from "@/lib/app/fetch"
import Image from "next/image"
import { useRouter } from "next/router"
import { createRef, useRef, useState } from "react"
import { Wrapper } from "../Layout"
import RegisterForm from "./RegisterForm"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

const Register = () => {
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const emailRef = useRef()
	const passwordRef = useRef()
	const confirmPasswordRef = useRef()
	const nameRef = useRef()
	const usernameRef = useRef()
	const [loading, setLoading] = useState(false)
	const [acceptTerms, setAcceptTerms] = useState(false)
	const [ageTerms, setAgeTerms] = useState(false)
	const recaptchaRef = createRef()

	const router = useRouter()
	const onSubmit = async event => {
		event.preventDefault()
		// Execute the reCAPTCHA when the form is submitted
		// recaptchaRef.current.execute()
		const token = recaptchaRef.current.getValue()
		// If the reCAPTCHA code is null or undefined indicating that
		// the reCAPTCHA was expired then return early
		if (!token) {
			setErrorMessage("Captcha is missing. Please try again.")
			return
		}
		try {
			if (
				passwordRef.current.value.length < 6 ||
				confirmPasswordRef.current.value.length < 6
			) {
				setErrorMessage("Password cannot be less than 6 characters.")
				return
			}

			if (
				passwordRef.current.value !== confirmPasswordRef.current.value
			) {
				setErrorMessage("Passwords do not match. Please try again.")
				return
			}

			if (!acceptTerms) {
				setErrorMessage(
					"You must accept the terms and conditions before signing up."
				)
				return
			}

			if (!ageTerms) {
				setErrorMessage("You must be over 13 years old to sign up.")
				return
			}
			setLoading(true)
			await fetcher("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: nameRef.current.value,
					username: usernameRef.current.value,
					email: emailRef.current.value,
					password: passwordRef.current.value,
					role: "user",
					captcha: token
				})
			})
			setSuccessMessage(
				"Your account has been created. An email has been sent to your email address for verification."
			)
			setTimeout(() => {
				router.replace("/login")
			}, 1500)
		} catch (error) {
			setErrorMessage(error?.message || "Something went wrong")
		} finally {
			// Reset the reCAPTCHA when the request has failed or succeeeded
			// so that it can be executed again if user submits another email.
			recaptchaRef.current?.reset()
			setLoading(false)
		}
	}

	return (
		<Wrapper className={""}>
			<section className="pt-12 overflow-visible bg-white dark:bg-gray-900">
				<div className="grid grid-cols-8 ">
					<div className="col-span-8 md:col-span-5">
						<div className="flex flex-col items-start mx-auto lg:py-0">
							<div className="w-full rounded-lg shadow bg-gray-50 dark:border md:mt-0 sm:max-w-xl xl:p-0 ">
								<RegisterForm
									formType="register"
									nameRef={nameRef}
									usernameRef={usernameRef}
									emailRef={emailRef}
									passwordRef={passwordRef}
									confirmPasswordRef={confirmPasswordRef}
									recaptchaRef={recaptchaRef}
									setAcceptTerms={setAcceptTerms}
									setAgeTerms={setAgeTerms}
									onSubmit={onSubmit}
								/>
							</div>
						</div>
					</div>
					<div className="hidden md:col-span-3 drop-shadow-lg md:block">
						<Image
							src="/illustration.png"
							alt="Register Podcasters"
							width={898}
							height={1465}
							className="drop-shadow-lg"
						/>
					</div>
				</div>
			</section>
		</Wrapper>
	)
}

export default Register
