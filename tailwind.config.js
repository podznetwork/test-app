module.exports = {
	mode: "jit",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}"
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				// primary: {
				// 	50: "#eff6ff",
				// 	100: "#dbeafe",
				// 	200: "#bfdbfe",
				// 	300: "#93c5fd",
				// 	400: "#60a5fa",
				// 	500: "#3b82f6",
				// 	600: "#2563eb",
				// 	700: "#1d4ed8",
				// 	800: "#1e40af",
				// 	900: "#1e3a8a"
				// },
				primary: {
					DEFAULT: "#EF620C",
					50: "#FDEADE",
					100: "#FCDDCB",
					200: "#FAC5A4",
					300: "#F8AC7D",
					400: "#F79356",
					500: "#F57A2F",
					600: "#EF620C",
					700: "#BA4C09",
					800: "#843607",
					900: "#4F2004"
				},
				secondary: {
					DEFAULT: "#F0BB9B",
					50: "#FFFFFF",
					100: "#FFFFFF",
					200: "#FFFFFF",
					300: "#FBEBE2",
					400: "#F5D3BE",
					500: "#F0BB9B",
					600: "#E99A6A",
					700: "#E17939",
					800: "#C55D1E",
					900: "#944616"
				}
			}
		},
		fontFamily: {
			body: [
				"Inter",
				"ui-sans-serif",
				"system-ui",
				"-apple-system",
				"system-ui",
				"Segoe UI",
				"Roboto",
				"Helvetica Neue",
				"Arial",
				"Noto Sans",
				"sans-serif",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji"
			],
			sans: [
				"Inter",
				"ui-sans-serif",
				"system-ui",
				"-apple-system",
				"system-ui",
				"Segoe UI",
				"Roboto",
				"Helvetica Neue",
				"Arial",
				"Noto Sans",
				"sans-serif",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji"
			]
		}
	},
	plugins: [require("@tailwindcss/line-clamp"), require("tailwind-scrollbar")]
}
