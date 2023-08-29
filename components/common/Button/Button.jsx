import { LoadingDots } from "@/components/common/LoadingDots"
import clsx from "clsx"
import { forwardRef } from "react"
import styles from "./Button.module.css"

export const buttonVariants = {
	PRIMARY: "primary",
	SECONDARY: "secondary"
}

const buttonStyles = {
	secondary:
		"bg-white border border-primary-600 rounded-[14px] px-5 py-2 text-sm",
	primary:
		"bg-primary-600 rounded-[14px] px-5 py-2 text-white text-sm border-primary"
}

export const Button = forwardRef(function Button(
	{
		style,
		children,
		type,
		className,
		onClick,
		size,
		variant,
		loading,
		disabled
	},
	ref
) {
	return (
		<button
			className={clsx(
				variant ? buttonStyles[variant] : styles.button,
				type && styles[type],
				size && styles[size],
				styles[variant],
				className
			)}
			style={style}
			ref={ref}
			onClick={onClick}
			disabled={loading || disabled}
		>
			{loading && <LoadingDots className={styles.loading} />}
			{children}
		</button>
	)
})

export const ButtonLink = forwardRef(function Button(
	{ children, type, className, href, onClick, size, variant = "invert" },
	ref
) {
	return (
		<a
			className={clsx(
				variant ? buttonStyles[variant] : styles.button,
				type && styles[type],
				size && styles[size],
				className
			)}
			ref={ref}
			href={href}
			onClick={onClick}
		>
			<span>{children}</span>
		</a>
	)
})
