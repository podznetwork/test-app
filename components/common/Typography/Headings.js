import clsx from "clsx"
import { forwardRef } from "react"
import { LoadingDots } from "../LoadingDots"
import { Button } from "../Button"
import { buttonVariants } from "../Button/Button"

export const SectionHeading = forwardRef(function SectionHeading({
	children,
	replaceClassName,
	className,
	button,
	buttonOnClick,
	loading,
	button2,
	button2OnClick,
	loading2,
	...props
}) {
	return (
		<div
			className={
				replaceClassName
					? replaceClassName
					: `w-full flex flex-col lg:flex-row lg:items-center grow gap-4 ${className}`
			}
			{...props}
		>
			<div>
				<h2 className="text-lg font-medium md:text-[22px]">
					{children}
				</h2>
			</div>
			{button && (
				<Button
					className="w-full md:w-auto"
					onClick={buttonOnClick}
					variant={buttonVariants.SECONDARY}
				>
					{loading ? <LoadingDots /> : button}
				</Button>
			)}
			{button2 && (
				<Button
					className="w-full md:w-auto"
					onClick={button2OnClick}
					variant={buttonVariants.SECONDARY}
				>
					{loading2 ? <LoadingDots /> : button2}
				</Button>
			)}
		</div>
	)
})

export const H1 = forwardRef(function H1(
	{ children, onClick, className, loading, disabled },
	ref
) {
	return (
		<h1
			onClick={onClick}
			ref={ref}
			disabled={loading || disabled}
			className={clsx(
				"text-5xl font-extrabold dark:text-white",
				className
			)}
		>
			{loading && <LoadingDots className="mr-0.5" />}
			{children}
		</h1>
	)
})

export const H2 = forwardRef(function H2(
	{ children, onClick, className, loading, disabled },
	ref
) {
	return (
		<h1
			onClick={onClick}
			ref={ref}
			disabled={loading || disabled}
			className={clsx("text-4xl font-bold dark:text-white", className)}
		>
			{loading && <LoadingDots className="mr-0.5" />}
			{children}
		</h1>
	)
})
export const H3 = forwardRef(function H3(
	{ children, onClick, className, loading, disabled },
	ref
) {
	return (
		<h1
			onClick={onClick}
			ref={ref}
			disabled={loading || disabled}
			className={clsx("text-3xl font-bold dark:text-white", className)}
		>
			{loading && <LoadingDots className="mr-0.5" />}
			{children}
		</h1>
	)
})
