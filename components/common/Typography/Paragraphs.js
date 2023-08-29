import clsx from "clsx"
import { forwardRef } from "react"
import { LoadingDots } from "../LoadingDots"
export const P = forwardRef(function P(
	{ children, onClick, className, loading, disabled },
	ref
) {
	return (
		<h1
			onClick={onClick}
			ref={ref}
			disabled={loading || disabled}
			className={clsx(
				"mb-3 font-light text-gray-500 dark:text-gray-400",
				className
			)}
		>
			{loading && <LoadingDots className="mr-0.5" />}
			{children}
		</h1>
	)
})
