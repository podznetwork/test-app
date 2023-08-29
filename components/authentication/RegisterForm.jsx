import { signIn } from "next-auth/react"
import Link from "next/link"
import ReCAPTCHA from "react-google-recaptcha"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

export default function RegisterForm({
	formType,
	nameRef,
	usernameRef,
	emailRef,
	passwordRef,
	confirmPasswordRef,
	recaptchaRef,
	setAcceptTerms,
	setAgeTerms,
	onSubmit
}) {
	const { setErrorMessage } = useErrorContext()
	const fieldStyles = {
		disabledField: `bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`,
		enabledField: `bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`
	}

	const handleGoogleSignIn = async event => {
		event.preventDefault()
		try {
			await signIn("google")
		} catch (e) {
			setErrorMessage(e.message)
		}
	}

	return (
		<div className="px-6 py-4 space-y-2 sm:px-8">
			<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
				{formType === "signUpCompletion"
					? "Complete user sign up"
					: "Create an account"}
			</h1>
			<form className="space-y-4 md:space-y-6">
				<div className="grid grid-cols-6 gap-6">
					<div className="col-span-6 sm:col-span-3">
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Name
						</label>
						<input
							ref={nameRef}
							type="text"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="Bonnie Green"
							required=""
						/>
					</div>
					<div className="col-span-6 sm:col-span-3">
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Username
						</label>
						<input
							ref={usernameRef}
							type="text"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="bonnie123"
							required=""
						/>
					</div>
					<div className="col-span-6">
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Your email
						</label>
						<input
							disabled={
								formType === "signUpCompletion" ? true : false
							}
							ref={emailRef ?? ""}
							type="email"
							name="email"
							id="email"
							className={
								formType === "signUpCompletion"
									? fieldStyles.disabledField
									: fieldStyles.enabledField
							}
							placeholder="name@company.com"
							required=""
						/>
					</div>
					<div className="col-span-6 sm:col-span-3">
						<label
							htmlFor="password"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Password
						</label>
						<input
							ref={passwordRef}
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							required=""
						/>
					</div>
					<div className="col-span-6 sm:col-span-3">
						<label
							htmlFor="confirm-password"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Confirm password
						</label>
						<input
							ref={confirmPasswordRef}
							type="password"
							name="confirm-password"
							id="confirm-password"
							placeholder="••••••••"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							required=""
						/>
					</div>
				</div>
				<div className="flex items-start">
					<div className="flex items-center h-5">
						<input
							onChange={e => setAgeTerms(e.target.checked)}
							id="terms"
							aria-describedby="terms"
							type="checkbox"
							className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
							required=""
						/>
					</div>
					<div className="ml-3 text-sm">
						<label
							htmlFor="terms"
							className="font-light text-gray-500 dark:text-gray-300"
						>
							I am over 13 years old.
						</label>
					</div>
				</div>
				<div className="flex items-start">
					<div className="flex items-center h-5">
						<input
							onChange={e => setAcceptTerms(e.target.checked)}
							id="terms"
							aria-describedby="terms"
							type="checkbox"
							className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
							required=""
						/>
					</div>
					<div className="ml-3 text-sm">
						<label
							htmlFor="terms"
							className="font-light text-gray-500 dark:text-gray-300"
						>
							I accept the{" "}
							<Link href="/terms">
								<a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
									Terms & Agreement
								</a>
							</Link>
						</label>
					</div>
				</div>
				{recaptchaRef && (
					<ReCAPTCHA
						ref={recaptchaRef}
						size="normal"
						sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
						// onChange={onReCAPTCHAChange}
					/>
				)}
				<button
					onClick={onSubmit}
					type="submit"
					className="w-full text-white bg-primary hover:bg-white hover:text-primary hover:border-rose-600 border focus:ring-4 focus:outline-none focus:ring-[#F0BB9B] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
				>
					Create an account
				</button>
				<p className="text-sm font-light text-gray-500 dark:text-gray-400">
					Already have an account?{" "}
					<Link
						href="/login"
						className="font-medium text-primary-600 hover:underline dark:text-primary-500"
					>
						Login here
					</Link>
				</p>
			</form>
			{/* {formType === "register" && (
				<hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700"></hr>
			)} */}
			{formType === "register" && (
				<div className="items-center">
					<button
						type="button"
						className="w-full  text-white bg-primary hover:bg-white hover:text-primary border hover:border-primary focus:ring-4 focus:outline-none focus:ring-primary/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
						onClick={handleGoogleSignIn}
					>
						<svg
							className="w-4 h-4 mr-2 -ml-1"
							aria-hidden="true"
							focusable="false"
							data-prefix="fab"
							data-icon="google"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 488 512"
						>
							<path
								fill="currentColor"
								d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
							></path>
						</svg>
						Sign in with Google
					</button>
				</div>
			)}
		</div>
	)
}
