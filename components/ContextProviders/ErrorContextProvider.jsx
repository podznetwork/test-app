import { createContext, useContext, useState } from "react"

const ErrorContext = createContext()

function ErrorContextProvider({ children }) {
	const [successMessage, setSuccessMessage] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)

	return (
		<ErrorContext.Provider
			value={{
				successMessage,
				setSuccessMessage,
				errorMessage,
				setErrorMessage
			}}
		>
			{children}
		</ErrorContext.Provider>
	)
}

export function useErrorContext() {
	const contextValue = useContext(ErrorContext)

	if (contextValue === undefined) {
		throw new Error("The context value is undefined")
	}

	return contextValue
}

export default ErrorContextProvider
