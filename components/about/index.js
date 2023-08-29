import Image from "next/image"
import Link from "next/link"
import { ButtonLink } from "../common/Button"
function About() {
	return (
		<div className="mb-60 md:mb-0">
			<section>
				<div className="container grid grid-cols-2 gap-x-6 px-6 mx-auto space-y-6 lg:h-[28rem] items-center">
					<div className="col-span-2 lg:col-span-1">
						<div className="lg:max-w-lg">
							<h1 className="text-2xl font-medium tracking-wide text-gray-800 dark:text-white lg:text-4xl">
								Share Stories. Make Friends
							</h1>
							<p className="mt-10 text-gray-600 dark:text-gray-300">
								A community of storytellers, creatives, and
								entertainment lovers. We're here to help
								talented, up-and-coming podcasters share their
								stories. <br />
							</p>

							<div className="flex mt-8">
								<div className="grid grid-cols-2 gap-6 lg:grid-cols-3 justify-items-center">
									<Link passHref href="/pricing">
										<button
											type="button"
											className="px-5 py-3 text-sm font-medium text-center text-white rounded-lg bg-primary sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
										>
											Get Started
										</button>
									</Link>
									<Link passHref href="/contact">
										<button
											type="button"
											className="px-5 py-3 text-sm font-medium text-center text-white rounded-lg bg-primary sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
										>
											Any Questions?
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-center w-full col-span-2 lg:col-span-1 h-96">
						<img
							className="object-cover w-full h-full max-w-2xl rounded-md"
							src="pod1.jpg"
							alt="photo"
						/>
					</div>
				</div>
			</section>
			<section className="mt-8 lg:mt-0">
				<div className="container grid grid-cols-2 px-6 mx-auto space-y-6 h-[28rem] items-center">
					<div className="relative flex items-center justify-center order-2 w-full col-span-2 mt-4 lg:order-1 lg:col-span-1 h-96">
						<Image
							className="object-cover w-full h-full max-w-2xl rounded-md"
							src="/pod5.jpg"
							alt="photo"
							width={576}
							height={384}
						/>
					</div>
					<div className="order-1 col-span-2 lg:order-2 lg:col-span-1 lg:ml-10">
						<div className="lg:max-w-lg">
							<h1 className="text-2xl font-medium tracking-wide text-gray-800 dark:text-white lg:text-4xl">
								Find your voice, and join the conversation.
							</h1>
							<p className="mt-10 text-gray-600 dark:text-gray-300">
								Everyone has a story, and Podz Network wants to
								share yours. From comedy to horror to sports,
								PODZ Network has something for everyone. And
								with a strong focus on quality content, you can
								be assured that you're getting the best shows.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="mt-48 lg:mt-0">
				<div className="container grid grid-cols-2 px-6 mx-auto space-y-6 h-[28rem] items-center">
					<div className="col-span-2 lg:col-span-1">
						<div className="lg:max-w-lg">
							<h1 className="text-2xl font-medium tracking-wide text-gray-800 dark:text-white lg:text-4xl">
								Take it to the next level
							</h1>
							<p className="mt-10 text-gray-600 dark:text-gray-300">
								Offering a unique and affordable way to promote
								and advertise podcasts and reach a new audience.
								With a variety of promotional tools and
								services, PODZ Network makes it easy for
								podcasters to get their show in front of new
								listeners.
							</p>
						</div>
					</div>

					<div className="flex items-center justify-center w-full col-span-2 lg:col-span-1 h-96">
						<img
							className="object-cover w-full h-full max-w-2xl rounded-md"
							src="/pod4.jpg"
							alt="photo"
						/>
					</div>
				</div>
			</section>
			<section className="mt-40 lg:mt-0">
				<div className="container px-6 mx-auto space-y-6 h-[28rem] grid grid-cols-2 items-center ">
					<div className="flex items-center order-2 w-full col-span-2 mb-2 lg:order-1 lg:col-span-1 h-96">
						<img
							className="object-cover w-full h-full max-w-2xl rounded-md"
							src="/pod6.jpg"
							alt="photo"
						/>
					</div>
					<div className="order-1 w-full col-span-2 lg:order-2 lg:col-span-1 lg:ml-10">
						<div className="lg:max-w-lg">
							<h1 className="mt-4 text-2xl font-medium tracking-wide text-gray-800 dark:text-white lg:text-4xl">
								Discover something new, enjoy on the go
							</h1>
							<p className="mt-10 text-gray-600 dark:text-gray-300">
								Discover new podcasts, listen to your favorite
								shows and get recommendations based on what
								you're into. With our curated feed full of
								episodes you'll love and helpful search tools,
								Podz is the podcast player for everyone.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default About
