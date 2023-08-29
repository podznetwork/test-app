import { Wrapper } from "@/components/Layout"
import { genreList as defaultGenreList, useEpisodes } from "@/lib/app/episode"
import { useGalleryImages } from "@/lib/app/gallery"
import { useAllPodcasts } from "@/lib/app/podcast"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LoadingDots } from "../common/LoadingDots"
import Spinner from "../common/Spinner"
import Featured from "../content/Featured"
import Recent from "../content/Recent"
import { Footer } from "../footer/"
import NewsLetter from "../newsletter"
import styles from "./Home.module.css"

const Home = () => {
	const { podcasts, loading: podcastsLoading } = useAllPodcasts(true)
	const [loading, setLoading] = useState(false)

	const buttonStyles = {
		activeSlideDot: "w-3 h-3 rounded-full bg-white dark:bg-gray-800",
		inactiveSlideDot:
			"w-3 h-3 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800",
		activeNavButton:
			"flex items-center justify-center h-full border-l cursor-pointer group focus:outline-none",
		inactiveNavButton:
			"flex items-center justify-center h-full border-l cursor-not-allowed group focus:outline-none",
		activeNavButtonStyle:
			"bg-black inline-flex items-center justify-center w-10 h-8 sm:w-12 sm:h-10 dark:bg-white/30 bg-gray-800/30 group-hover:bg-gray-800/60 dark:group-hover:bg-white/50 group-focus:outline-none",
		inactiveNavButtonStyle:
			"bg-black inline-flex items-center justify-center w-10 h-8 sm:w-12 sm:h-10 dark:bg-white/10 bg-gray-800/10 group-focus:outline-none",
		activeGenreButton:
			"bg-primary hover:bg-primary mt-2 text-[#fafafa] text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 dark:hover:bg-primary-300",
		inactiveGenreButton:
			"bg-gray-100 hover:bg-primary mt-2 hover:text-[#fafafa] text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
	}

	const genreList = ["Default", ...defaultGenreList]

	const { images, loading: imagesLoading } = useGalleryImages()
	const [selectedImage, setSelectedImage] = useState(null)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [selectedGenre, setSelectedGenre] = useState("Default")
	const { episodesData, loading: episodesLoading } = useEpisodes({
		itemsPerPage: 10
	})

	const filteredEpisodes = genre => {
		if (genre.toLowerCase() === "default") {
			return episodesData?.episodes
		} else {
			const genreEpisodes = episodesData?.episodes.filter(episode => {
				const lowerCaseGenre = episode.podcast.genre.map(gen =>
					gen.toLowerCase()
				)
				return lowerCaseGenre.includes(genre.toLowerCase())
			})

			return genreEpisodes
		}
	}

	useEffect(() => {
		if (images && !selectedImage) {
			setSelectedImage(images[0])
			const timer = window.setInterval(() => {
				setCurrentSlide(prevSlide => {
					if (prevSlide === images.length - 1) {
						return 0
					} else {
						return prevSlide + 1
					}
				})
			}, 10000)
			return () => {
				window.clearInterval(timer)
			}
		}
	}, [images])

	useEffect(() => {
		if (images) {
			setSelectedImage(images[currentSlide])
		}
	}, [currentSlide])

	return (
		<Wrapper>
			<div
				id="default-carousel"
				className="relative"
				data-carousel="static"
			>
				<div className={styles.menubutton}>
					<Link href={selectedImage?.url ?? "#"}>
						<div
							className="absolute inset-0 z-20 transition-all duration-700 ease-in-out transform translate-x-0 cursor-pointer"
							data-carousel-item=""
						>
							{imagesLoading ? (
								<Spinner />
							) : (
								selectedImage && (
									<img
										src={selectedImage.path}
										className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
										alt="..."
									/>
								)
							)}
						</div>
					</Link>

					<div
						className="absolute inset-0 z-10 transition-all duration-700 ease-in-out transform translate-x-full"
						data-carousel-item=""
					>
						<img
							src="/carousel/1.png"
							className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
							alt="..."
						/>
					</div>

					<div
						className="absolute inset-0 z-10 transition-all duration-700 ease-in-out transform -translate-x-full"
						data-carousel-item=""
					>
						<img
							src="/carousel/1.png"
							className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
							alt="..."
						/>
					</div>
				</div>

				<div className="absolute bottom-[16px] z-30 flex space-x-3 -translate-x-1/2 left-1/2">
					{images?.map((image, index) => (
						<button
							key={image._id}
							onClick={() => {
								setLoading(true)
								setSelectedImage(images[index])
								setCurrentSlide(index)
								setLoading(false)
							}}
							type="button"
							className={
								selectedImage?._id === images[index]._id
									? buttonStyles.activeSlideDot
									: buttonStyles.inactiveSlideDot
							}
						>
							{loading ? <LoadingDots /> : ""}
						</button>
					))}
				</div>

				{/* <div className="flex w-[200px] ml-auto justify-end mt-2">
					<button
						onClick={() => {
							setLoading(true)
							setCurrentSlide(prevSlide => prevSlide - 1)
							setLoading(false)
						}}
						disabled={currentSlide === 0}
						type="button"
						className={
							currentSlide === 0
								? buttonStyles.inactiveNavButton
								: buttonStyles.activeNavButton
						}
						data-carousel-prev=""
					>
						<span
							className={
								currentSlide === 0
									? buttonStyles.inactiveNavButtonStyle
									: buttonStyles.activeNavButtonStyle
							}
						>
							{loading ? (
								<LoadingDots />
							) : (
								<svg
									aria-hidden="true"
									className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 19l-7-7 7-7"
									></path>
								</svg>
							)}
							<span className="sr-only">Previous</span>
						</span>
					</button>
					<button
						disabled={currentSlide === images?.length - 1}
						onClick={() => {
							setLoading(true)
							setCurrentSlide(prevSlide => prevSlide + 1)
							setLoading(false)
						}}
						type="button"
						className={
							currentSlide === images?.length - 1
								? buttonStyles.inactiveNavButton
								: buttonStyles.activeNavButton
						}
						data-carousel-next=""
					>
						<span
							className={
								currentSlide === images?.length - 1
									? buttonStyles.inactiveNavButtonStyle
									: buttonStyles.activeNavButtonStyle
							}
						>
							{loading ? (
								<LoadingDots />
							) : (
								<svg
									aria-hidden="true"
									className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							)}
							<span className="sr-only">Next</span>
						</span>
					</button>
				</div> */}
			</div>

			<section className="mt-4">
				<h5> Select a Genre:</h5>
				<div className="mt-2 text-center lg:text-left">
					{genreList.map((genre, index) => (
						<button
							onClick={() => setSelectedGenre(genre)}
							key={index}
							className={
								genre.toLowerCase() ===
								selectedGenre.toLowerCase()
									? buttonStyles.activeGenreButton
									: buttonStyles.inactiveGenreButton
							}
						>
							{genre}
						</button>
					))}
				</div>
				<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
			</section>
			<section>
				<h2 className="text-3xl font-bold">Recent Episodes</h2>
				<Recent
					episodesLoading={episodesLoading}
					episodes={filteredEpisodes(selectedGenre)}
					selectedGenre={selectedGenre}
				/>
			</section>
			<section>
				<h2 className="mt-5 text-3xl font-bold">Featured Podcasts</h2>
				{podcastsLoading ? (
					<Spinner />
				) : (
					<Featured podcasts={podcasts} />
				)}
			</section>
			<NewsLetter />
			<Footer />
		</Wrapper>
	)
}

export default Home
