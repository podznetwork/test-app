import { sendEmail } from "@/lib/app/email"
import { useRef, useState } from "react"
import { LoadingDots } from "../common/LoadingDots"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

const Contact = () => {
	const { setErrorMessage, setSuccessMessage } = useErrorContext()
	const [loading, setLoading] = useState(false)
	const emailRef = useRef()
	const subjectRef = useRef()
	const messageRef = useRef()

	const onSubmit = async e => {
		e.preventDefault()
		if (
			emailRef.current.value === "" ||
			subjectRef.current.value === "" ||
			messageRef.current.value === ""
		) {
			setErrorMessage(
				"Make sure all the fields are filled before submitting."
			)
			return
		}

		try {
			setLoading(true)
			await sendEmail({
				type: "contact",
				data: {
					email: emailRef.current.value,
					subject: subjectRef.current.value,
					message: messageRef.current.value
				}
			})
			emailRef.current.value = ""
			subjectRef.current.value = ""
			messageRef.current.value = ""
			setLoading(false)
			setSuccessMessage("Message sent successfully")
		} catch (error) {
			setLoading(false)
			setErrorMessage(error.message)
		}
	}

	return (
		<section>
			<div className="max-w-screen-md px-4 py-8 mx-auto lg:py-8">
				<h2 className="mb-4 text-4xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white">
					Contact Us
				</h2>
				<p className="mb-8 font-light text-center text-gray-500 lg:mb-8 dark:text-gray-400 sm:text-xl">
					Thank you for showing your interest in Podz Network. Please
					fill out the form below and we will get back to you.
				</p>
				<form className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
						>
							Your email
						</label>
						<input
							ref={emailRef}
							type="email"
							id="email"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
							placeholder="name@gmail.com"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="subject"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
						>
							Subject
						</label>
						<input
							ref={subjectRef}
							type="text"
							id="subject"
							className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
							placeholder="Let us know how we can help you"
							required
						/>
					</div>
					<div className="sm:col-span-2">
						<label
							htmlFor="message"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
						>
							Your message
						</label>
						<textarea
							ref={messageRef}
							id="message"
							rows="6"
							className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="Leave a comment..."
						></textarea>
					</div>
					<button
						onClick={onSubmit}
						type="submit"
						className="float-right px-5 py-3 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					>
						{loading ? <LoadingDots /> : "Send message"}
					</button>
				</form>
			</div>
		</section>
	)
}

export default Contact
