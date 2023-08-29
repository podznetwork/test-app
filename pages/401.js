import { Wrapper } from "@/components/Layout"
import Link from "next/link"

const ErrorPage = () => {
	return (
		<Wrapper>
			<section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
				<div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
					<div className="max-w-md text-center">
						<h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
							<span className="sr-only">Unauthorized</span>401
						</h2>
						<p className="text-2xl font-semibold md:text-3xl">
							Sorry, You don't have access to this page.
						</p>
						<p className="mt-4 mb-8 dark:text-gray-400">
							Please contact admin for access.
						</p>
						<Link href={"/"}>
							<a
								rel="noopener noreferrer"
								className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900"
							>
								Back to homepage
							</a>
						</Link>
					</div>
				</div>
			</section>
		</Wrapper>
	)
}

export default ErrorPage
