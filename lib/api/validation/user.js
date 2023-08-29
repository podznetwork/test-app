export const ValidateUser = {
	username: { type: "string", minLength: 4, maxLength: 20 },
	name: { type: "string", minLength: 1, maxLength: 50 },
	password: { type: "string", minLength: 8 },
	email: { type: "string", minLength: 1 },
	bio: { type: "string", minLength: 0, maxLength: 160 },
	role: { type: "string", minLength: 1, maxLength: 30 },
	captcha: { type: "string", minLength: 1 }
}

export const ValidateAdminAddedUser = {
	name: { type: "string", minLength: 1, maxLength: 50 },
	email: { type: "string", minLength: 1 },
	role: { type: "string", minLength: 1, maxLength: 10 },
	access: {
		type: "array",
		items: {
			type: "string",
			minLength: 1
		}
	}
}
