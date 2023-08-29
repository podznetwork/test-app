import { sendEmail } from "@/lib/app/email"
import { useRef, useState } from "react"
import { LoadingDots } from "../common/LoadingDots"
import { Wrapper } from "../Layout"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

function Advertise() {
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const [loading, setLoading] = useState(false)
	const nameRef = useRef()
	const emailRef = useRef()
	const podcastRef = useRef()
	const phoneRef = useRef()
	const messageRef = useRef()

	const onSubmit = async e => {
		e.preventDefault()
		if (
			nameRef.current.value === "" ||
			emailRef.current.value === "" ||
			podcastRef.current.value === "" ||
			phoneRef.current.value === "" ||
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
				type: "advertise",
				data: {
					name: nameRef.current.value,
					email: emailRef.current.value,
					podcast: podcastRef.current.value,
					phone: phoneRef.current.value,
					message: messageRef.current.value
				}
			})
			nameRef.current.value = ""
			emailRef.current.value = ""
			podcastRef.current.value = ""
			phoneRef.current.value = ""
			messageRef.current.value = ""
			setLoading(false)
			setSuccessMessage("Message sent successfully")
		} catch (error) {
			setLoading(false)
			setErrorMessage(error.message)
		}
	}

	return (
		<Wrapper>
			<section>
				<div className="container px-6 mx-auto">
					<div className="lg:flex lg:items-center lg:-mx-10">
						<div className="lg:w-1/2 lg:mx-10">
							<h1 className="text-gray-500 capitalize text-1xl dark:text-white lg:text-2xl">
								Advertise with us
							</h1>
							<h1 className="mt-8 text-3xl font-bold text-gray-800 dark:text-gray-400 lg:text-5xl">
								Build your brand.
							</h1>
							<p className="mt-8 text-xl text-gray-500 dark:text-gray-400">
								Make your mark. Not quite sure how you should
								approach podcasting? Let Podz be your guide.
								We're here to help you through the entire
								process, from ideation to execution. Just fill
								out the feedback form below, and we'll get in
								touch.
							</p>
						</div>
						<div className="mt-14 lg:flex lg:mt-0 lg:flex-col lg:items-center lg:w-1/2 lg:mx-10">
							<form className="mt-16">
								<div className="-mx-2 md:items-center md:flex">
									<div className="flex-1 px-2">
										<label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
											Full Name
										</label>
										<input
											ref={nameRef}
											type="text"
											placeholder="John Doe"
											className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-400 focus:ring-primary-400 focus:outline-none focus:ring focus:ring-opacity-40"
										/>
									</div>

									<div className="flex-1 px-2 mt-4 md:mt-0">
										<label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
											Email address
										</label>
										<input
											ref={emailRef}
											type="email"
											placeholder="johndoe@example.com"
											className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-400 focus:ring-primary-400 focus:outline-none focus:ring focus:ring-opacity-40"
										/>
									</div>
								</div>
								<div className="mt-5 -mx-2 md:items-center md:flex">
									<div className="flex-1 px-2">
										<label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
											Podcast Name
										</label>
										<input
											ref={podcastRef}
											type="text"
											placeholder="Truth Lies Shenanigans"
											className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-400 focus:ring-primary-400 focus:outline-none focus:ring focus:ring-opacity-40"
										/>
									</div>

									<div className="flex-1 px-2 mt-4 md:mt-0">
										<label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
											Phone Number
										</label>
										<input
											ref={phoneRef}
											type="text"
											placeholder="444-111-2234"
											className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-400 focus:ring-primary-400 focus:outline-none focus:ring focus:ring-opacity-40"
										/>
									</div>
								</div>

								<div className="w-full mt-4">
									<label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
										Message
									</label>
									<textarea
										ref={messageRef}
										className="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-56 dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-400 focus:ring-primary-400 focus:outline-none focus:ring focus:ring-opacity-40"
										placeholder="Message"
									></textarea>
								</div>

								<button
									onClick={onSubmit}
									className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-md bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50"
								>
									{loading ? <LoadingDots /> : "get in touch"}
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</Wrapper>
	)
}

export default Advertise
