import Fuse from "fuse.js"

const regex = {
	DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
}

//Search through a list/array of objects and return the one that matches even partially (fuzzy search)
export function fuzzySearch(list, searchTerm, options) {
	if (searchTerm === "") return list

	const fuse = new Fuse(list, options)
	const result = fuse.search(searchTerm)
	const locations = []
	result.forEach(location => {
		locations.push(location.item)
	})
	return locations
}

export function valueChecker(values, refs, fieldNames) {
	values.forEach((value, index) => {
		if (!value || value == "" || value.length == 0) {
			if (refs[index].current) {
				refs[index].current.focus()
			}
			throw new Error(`The ${fieldNames[index]} field cannot be empty.`)
		}
	})
}

export function isClickInsideNode(clickEvent, node) {
	return (
		clickEvent.target === node.current || node.contains(clickEvent.target)
	)
}

export function isDateType(dateString) {
	return regex.DATE.test(dateString)
}
