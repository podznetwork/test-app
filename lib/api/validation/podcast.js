export const ValidatePodcast = {
	name: { type: "string", minLength: 1 },
	description: { type: "string", minLength: 1 },
	hosts: {
		type: "array",
		items: {
			type: "object",
			properties: {
				_id: {
					type: "string",
					minLength: 1
				},
				confirmed: {
					type: "boolean"
				}
			}
		},
		minItems: 1
	},
	logoPath: { type: "string", minLength: 1 },
	genre: {
		type: "array",
		items: {
			type: "string",
			minLength: 1
		},
		minItems: 1
	}
}
