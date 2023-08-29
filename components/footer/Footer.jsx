import Link from "next/link"
import CustomImage from "../CustomImage/CustomImage"
const Footer = () => {
	return (
		<footer className="p-4 sm:p-2 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-between md:flex-row">
				<div className="mx-auto mb-2 md:mb-0 md:mx-0">
					<Link href="/" className="flex items-center" passHref>
						<CustomImage
							src="/logo.png"
							alt="Podznetwork Logo"
							height={16}
							width={150}
						/>
					</Link>
				</div>

				<ul className="flex text-gray-600 dark:text-gray-400">
					<li className="text-center hover:underline">
						<Link href="/shows" className="hover:underline">
							All Shows
						</Link>
					</li>
					<li className="ml-4 text-center md:ml-12">
						<a
							href="/advertise"
							className="hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Advertise
						</a>
					</li>
					<li className="ml-4 text-center md:ml-12">
						<a
							href="/contact"
							className="hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Contact
						</a>
					</li>
					<li className="ml-4 text-center hover:underline md:ml-12">
						<Link href="/privacy" className="hover:underline">
							Privacy Policy
						</Link>
					</li>
					<li className="ml-4 text-center hover:underline md:ml-12">
						<Link href="/cookies" className="hover:underline">
							Cookies Policy
						</Link>
					</li>
					<li className="ml-4 text-center hover:underline md:ml-12">
						<Link href="/terms" className="hover:underline">
							Terms & Agreement
						</Link>
					</li>
				</ul>
			</div>
			<hr className="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-4" />
			<div className="sm:flex sm:items-center sm:justify-between">
				<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
					© 2022{" "}
					<Link href="/" className="hover:underline">
						Podznetwork™
					</Link>
					. All Rights Reserved.
				</span>
				<div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
					<a
						href="https://www.instagram.com/podznetwork/"
						className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
								clipRule="evenodd"
							></path>
						</svg>
						<span className="sr-only">Instagram page</span>
					</a>
					<a
						href="https://www.facebook.com/PODZNetwork/"
						className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
								clipRule="evenodd"
							></path>
						</svg>
						<span className="sr-only">Facebook page</span>
					</a>
					<a
						href="https://www.youtube.com/channel/UCwHi3tjDB_wISmTR3k6AYmw"
						className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M 15 4 C 10.814 4 5.3808594 5.0488281 5.3808594 5.0488281 L 5.3671875 5.0644531 C 3.4606632 5.3693645 2 7.0076245 2 9 L 2 15 L 2 15.001953 L 2 21 L 2 21.001953 A 4 4 0 0 0 5.3769531 24.945312 L 5.3808594 24.951172 C 5.3808594 24.951172 10.814 26.001953 15 26.001953 C 19.186 26.001953 24.619141 24.951172 24.619141 24.951172 L 24.621094 24.949219 A 4 4 0 0 0 28 21.001953 L 28 21 L 28 15.001953 L 28 15 L 28 9 A 4 4 0 0 0 24.623047 5.0546875 L 24.619141 5.0488281 C 24.619141 5.0488281 19.186 4 15 4 z M 12 10.398438 L 20 15 L 12 19.601562 L 12 10.398438 z"
							/>
						</svg>
						<span className="sr-only">Youtube page</span>
					</a>
					<a
						href="https://www.tiktok.com/@podznetwork"
						className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.104,4,24,4z M22.689,13.474 c-0.13,0.012-0.261,0.02-0.393,0.02c-1.495,0-2.809-0.768-3.574-1.931c0,3.049,0,6.519,0,6.577c0,2.685-2.177,4.861-4.861,4.861 C11.177,23,9,20.823,9,18.139c0-2.685,2.177-4.861,4.861-4.861c0.102,0,0.201,0.009,0.3,0.015v2.396c-0.1-0.012-0.197-0.03-0.3-0.03 c-1.37,0-2.481,1.111-2.481,2.481s1.11,2.481,2.481,2.481c1.371,0,2.581-1.08,2.581-2.45c0-0.055,0.024-11.17,0.024-11.17h2.289 c0.215,2.047,1.868,3.663,3.934,3.811V13.474z"
								clipRule="evenodd"
							></path>
						</svg>
						<span className="sr-only">TikTok page</span>
					</a>
					<a
						href="https://twitter.com/PodzNetwork"
						className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
							target="_blank"
							rel="noopener noreferrer"
						>
							<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
						</svg>
						<span className="sr-only">Twitter page</span>
					</a>
				</div>
			</div>
		</footer>
	)
}
export default Footer
