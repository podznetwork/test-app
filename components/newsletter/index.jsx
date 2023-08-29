import Link from "next/link"
import { useRef } from "react"
import MailchimpSubscribe from "react-mailchimp-subscribe"
const NewsLetterForm = ({ status, message, onValidated }) => {
	const emailRef = useRef()

	const handleSubmit = e => {
		e.preventDefault()
		emailRef.current.value &&
			emailRef.current.value?.indexOf("@") > -1 &&
			onValidated({
				EMAIL: emailRef.current.value
			})
	}

	return (
		<>
			{status === "success" ? (
				<h2 className="mx-auto max-w-2xl text-left font-light sm:text-xl text-gray-300">
					You have successfully subscribed to our newsletter
				</h2>
			) : (
				<form onSubmit={e => handleSubmit(e)}>
					<div className="items-center mx-auto mt-8 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
						<div className="relative w-full">
							<label
								htmlFor="email"
								className="hidden mb-2 text-sm font-medium text-gray-300"
							>
								Email address
							</label>
							<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
								<svg
									className="w-5 h-5 text-gray-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
								</svg>
							</div>
							<input
								className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Enter your email"
								ref={emailRef}
								type="email"
								id="email"
								required={true}
							/>
						</div>
						<div>
							<button
								type="submit"
								className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary border-primary sm:rounded-none sm:rounded-r-lg hover:bg-white hover:text-primary focus:ring-4 focus:ring-rose-600 "
							>
								Subscribe
							</button>
						</div>
					</div>
				</form>
			)}
			{status === "sending" && (
				<div className="mx-auto mt-3 max-w-screen-sm text-sm text-left newsletter-form-footer text-gray-300">
					sending...
				</div>
			)}
			{status === "error" && (
				<div
					className="mx-auto mt-3 max-w-screen-sm text-sm text-left newsletter-form-footer text-gray-300"
					dangerouslySetInnerHTML={{ __html: message }}
				/>
			)}
			{status === "success" && (
				<div
					className="mx-auto mt-3 max-w-screen-sm text-sm text-left newsletter-form-footer text-gray-300"
					dangerouslySetInnerHTML={{ __html: message }}
				/>
			)}
		</>
	)
}

const NewsLetter = () => {
	const url = `https://podznetwork.us21.list-manage.com/subscribe/post?u=${process.env.NEXT_PUBLIC_MAILCHIMP_U}&id=${process.env.NEXT_PUBLIC_MAILCHIMP_ID}`

	return (
		<section className="bg-gray-800 rounded grid md:grid-cols-2 mt-3">
			<div className="pt-8 pb-4 px-8 mx-auto max-w-screen-xl md:py-8 lg:px-8">
				<h2 className="mb-4 text-2xl tracking-tight font-extrabold  sm:text-3xl text-white">
					Sign up for our newsletter
				</h2>
				<p className="mx-auto max-w-2xl font-light sm:text-xl text-gray-300">
					Stay up to date with announcements and exclusive discounts.
				</p>
			</div>
			<div className="pb-8 justify-center px-4 mx-auto max-w-screen-xl md:py-8 lg:px-8">
				<div className="mx-auto max-w-screen-md sm:text-center">
					<MailchimpSubscribe
						url={url}
						render={({ subscribe, status, message }) => (
							<NewsLetterForm
								status={status}
								message={message}
								onValidated={formData => subscribe(formData)}
							/>
						)}
					/>

					<div className="mx-auto mt-3 max-w-screen-sm text-sm text-left newsletter-form-footer text-gray-300">
						We care about the protection of your data.{" "}
						<Link href="/privacy" passHref>
							<a className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
								Read our Privacy Policy
							</a>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

export default NewsLetter
