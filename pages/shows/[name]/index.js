import PodcastComponent from "@/components/podcast"
import Head from "next/head"
import ErrorPage from "pages/404"
function PodcastPage({ podcast }) {
	return podcast ? (
		<>
			<Head>
				<title>{podcast.name}</title>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={podcast.name} />
				<meta
					name="twitter:description"
					content={podcast.description.slice(0, 70) + "..."}
				/>
				<meta
					name="twitter:image"
					content={`${process.env.NEXT_PUBLIC_WEB_URI}/api/og?logoPath=${podcast.logoPath}&title=${podcast.name}`}
				/>
				<meta
					property="og:image"
					content={`${process.env.NEXT_PUBLIC_WEB_URI}/api/og?logoPath=${podcast.logoPath}&title=${podcast.name}`}
				/>
				<meta
					property="og:image:url"
					content={`${process.env.NEXT_PUBLIC_WEB_URI}/api/og?logoPath=${podcast.logoPath}&title=${podcast.name}`}
				/>
				<meta
					property="og:image:secure_url"
					content={`${process.env.NEXT_PUBLIC_WEB_URI}/api/og?logoPath=${podcast.logoPath}&title=${podcast.name}`}
				/>
				<meta
					name="description"
					content={podcast.description.slice(0, 70) + "..."}
				/>
				<meta property="og:title" content={podcast.name} />
				<meta
					property="og:description"
					content={podcast.description.slice(0, 70) + "..."}
				/>
			</Head>
			<PodcastComponent podcast={podcast} />
		</>
	) : (
		<ErrorPage />
	)
}

export async function getServerSideProps(context) {
	const { name } = context.query
	let podcast
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_WEB_URI}/api/podcasts/name/${name}`
		)
		podcast = await response.json()
	} catch (e) {
		podcast = null
	}

	// Pass data to the page via props
	return { props: { podcast } }
}

export default PodcastPage
