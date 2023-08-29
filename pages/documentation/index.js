// import Editor from "@/components/editor/Editor"
import { Wrapper } from "@/components/Layout"

function Documentation() {
	return (
		<Wrapper>
			<div className="grid place-items-center h-screen">
				<div>
					<h1 className="text-4xl font-bold mb-10">
						Official Documentation
					</h1>

					<a
						href="https://docs.google.com/document/d/1qZTYkJrYg1q2FNCEExn4gZ-6uPWnfIF1hDTtJplFwLQ/edit"
						target="_blank"
						rel="noreferrer"
						className="inline-flex justify-center items-center p-5 text-base font-medium text-gray-500 bg-gray-50 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
					>
						<img
							width="32"
							alt="Google Docs"
							className="mr-4"
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Google_Docs_logo_%282014-2020%29.svg/32px-Google_Docs_logo_%282014-2020%29.svg.png"
						/>

						<span className="w-full">
							Podz Platform Documentation
						</span>
						<svg
							aria-hidden="true"
							className="ml-3 w-6 h-6"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							></path>
						</svg>
					</a>
				</div>
			</div>
		</Wrapper>
	)
}

export default Documentation
