import clsx from "clsx"
import { forwardRef } from "react"
import styles from "./Input.module.css"

const Input = forwardRef(function Input(
	{
		label,
		onChange,
		value,
		placeholder,
		className,
		htmlType,
		autoComplete,
		size,
		ariaLabel,
		disabled,
		required
	},
	ref
) {
	return (
		<div className={clsx(styles.root, className)}>
			<label>
				{label && <div className={styles.label}>{label}</div>}
				<input
					disabled={disabled}
					value={value}
					onChange={onChange}
					type={htmlType}
					autoComplete={autoComplete}
					placeholder={placeholder}
					ref={ref}
					className={clsx(styles.input, size && styles[size])}
					aria-label={ariaLabel}
					required={required}
				/>
			</label>
		</div>
	)
})

export default Input
