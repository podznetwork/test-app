import { fetcher } from "../fetch"

export async function sendEmail({ type, data }) {
	const url =
		type === "advertise"
			? "/api/email?type=advertise"
			: "/api/email?type=contact"
	return await fetcher(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
