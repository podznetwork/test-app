import { ImageResponse } from "@vercel/og"
export const config = {
	runtime: "experimental-edge"
}
export default async function handler(request) {
	const { searchParams } = request.nextUrl

	const podcastImage = searchParams.get("logoPath")
	const podcastTitle = searchParams.get("title")

	if (!podcastImage || !podcastTitle) {
		return new ImageResponse(
			(
				<div
					style={{
						display: "flex",
						fontSize: 60,
						color: "black",
						background: "#f6f6f6",
						width: "100%",
						height: "100%",
						paddingTop: 50,
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<img
						width="200"
						height="200"
						src={process.env.NEXT_PUBLIC_WEB_URI + "/logo.png"}
					/>
				</div>
			),
			{
				width: 1200,
				height: 630
			}
		)
	}
	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					fontSize: 60,
					color: "black",
					background: "#f6f6f6",
					width: "100%",
					height: "100%",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<img
					width="200"
					height="200"
					src={process.env.NEXT_PUBLIC_WEB_URI + "/logo.png"}
				/>
				<img width="256" height="256" src={podcastImage} />
				<p>{podcastTitle}</p>
			</div>
		),
		{
			width: 1200,
			height: 630
		}
	)
}
