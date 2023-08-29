/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,
	// images: {
	// },
	images: {
		domains: ["res.cloudinary.com"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**"
			}
		]
	}
}

module.exports = nextConfig
