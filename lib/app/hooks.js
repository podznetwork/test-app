import { useCallback, useEffect } from "react"
import { isClickInsideNode } from "./utils"

export function useOutsideClickDetector(
	eventListener,
	{ onOutsideClick = () => null, containerRefToIgnore } = {}
) {
	const defaultHandler = useCallback(
		e => {
			if (Array.isArray(containerRefToIgnore)) {
				const ignoreClick = containerRefToIgnore.some(ref => {
					return ref.current && isClickInsideNode(e, ref.current)
				})
				if (ignoreClick) return
			} else if (
				containerRefToIgnore.current &&
				isClickInsideNode(e, containerRefToIgnore.current)
			) {
				return
			}
			onOutsideClick()
		},
		[containerRefToIgnore, onOutsideClick]
	)

	useEffect(() => {
		const listener = eventListener ?? defaultHandler
		document.addEventListener("click", listener)
		return () => document.removeEventListener("click", listener)
	}, [defaultHandler, eventListener])

	return null
}
