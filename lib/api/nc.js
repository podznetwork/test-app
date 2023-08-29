export const ncRouteHandlerOpts = {
	onError: err => {
		console.error("nc error: " + err.stack)
	},
	onNoMatch: (req, res) => {
		res.status(404).end()
	}
}
