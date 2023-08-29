export const ValidateImage = {
	name: { type: "string", minLength: 1, maxLength: 50 },
	description: { type: "string", minLength: 1, maxLength: 500 },
	sponsored: { type: "boolean" },
	path: { type: "string", minLength: 1, maxLength: 150 },
	url: { type: "string", minLength: 1, maxLength: 150 }
}
