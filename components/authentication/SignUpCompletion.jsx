import { completeUserSignUp, useUser } from "@/lib/app/user"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { Wrapper } from "../Layout"
import RegisterForm from "./RegisterForm"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

function BadLink() {
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Invalid Link</h1>
			<p className="mt-2">
				It looks like you may have clicked on an invalid link. Please
				close this window and try again.
			</p>
		</div>
	)
}

const SignUpCompletion = ({ tokenId, userId, valid }) => {
	const { setErrorMessage, setSuccessMessage } = useErrorContext()
	const { user } = useUser(userId)
	const usernameRef = useRef()
	const nameRef = useRef()
	const emailRef = useRef()
	const passwordRef = useRef()
	const confirmPasswordRef = useRef()
	const [acceptTerms, setAcceptTerms] = useState(false)
	const [ageTerms, setAgeTerms] = useState(false)
	const [loading, setLoading] = useState(false)

	const router = useRouter()

	const onSubmit = async e => {
		e.preventDefault()
		if (
			passwordRef.current.value.length < 6 ||
			confirmPasswordRef.current.value.length < 6
		) {
			setErrorMessage("Password cannot be less than 6 characters.")
			return
		}
		if (passwordRef.current.value !== confirmPasswordRef.current.value) {
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
			setErrorMessage(
				"You must be over 13 years old to be able to sign up."
			)
			return
		}

		try {
			setLoading(true)
			await completeUserSignUp(user._id, {
				name: nameRef.current.value,
				username: usernameRef.current.value,
				password: passwordRef.current.value,
				token: tokenId
			})
			setSuccessMessage("You have successfully signed up!")
			setLoading(false)
			setTimeout(() => {
				router.replace("/login")
			}, 1500)
		} catch (e) {
			setLoading(false)
			setErrorMessage(e.message)
		}
	}

	useEffect(() => {
		if (user) {
			emailRef.current.value = user.email
			nameRef.current.value = user.name
		}
	}, [user])

	return (
		<Wrapper>
			{valid && user ? (
				<section className="pt-12 bg-white dark:bg-gray-900">
					<div className="grid grid-cols-8 ">
						<div className="col-span-8 md:col-span-5">
							<div className="flex flex-col items-start mx-auto md:h-screen lg:py-0">
								<div className="w-full rounded-lg shadow bg-gray-50 dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
									<RegisterForm
										formType="signUpCompletion"
										nameRef={nameRef}
										usernameRef={usernameRef}
										emailRef={emailRef}
										passwordRef={passwordRef}
										confirmPasswordRef={confirmPasswordRef}
										setAgeTerms={setAgeTerms}
										setAcceptTerms={setAcceptTerms}
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
								height={1330}
							/>
						</div>
					</div>
				</section>
			) : (
				<BadLink />
			)}
		</Wrapper>
	)
}

export default SignUpCompletion
