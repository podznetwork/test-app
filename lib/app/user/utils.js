import { compare, genSalt, hash } from "bcryptjs"
import slug from "slug"

export const slugUsername = username => slug(username, "_")

export const hashPassword = async password => {
	const salt = await genSalt(10)
	return await hash(password, salt)
}

export const verifyPassword = async (plainPassword, hashedPassword) => {
	return await compare(plainPassword, hashedPassword)
}

export const userRoles = {
	ADMIN: "admin",
	USER: "user",
	OWNER: "owner",
	HOST: "host",
	GUEST: "guest",
	EDITOR: "editor"
}

export const isUser = userId => userId?.match(/^[0-9a-fA-F]{24}$/)
