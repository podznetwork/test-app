import clsx from "clsx"
import Select from "react-select"
import styles from "./Input.module.css"
import CreatableSelect from "react-select/creatable"

export const selectInputVariants = {
	WHITE: "WHITE",
	LIGHT_primary: "LIGHTT_primary"
}

const selectInputVariantsStyles = {
	[selectInputVariants.WHITE]: "bg-white",
	[selectInputVariants.LIGHT_primary]: "bg-light-primary"
}

const selectStyles = `w-full !rounded-[14px] px-[15px] py-2 bg-white text-black text-xs outline-none`

const customStyles = {
	multiValue: baseStyles => ({
		...baseStyles,
		padding: "2px 5px",
		borderRadius: "100px",
		color: "white",
		backgroundColor: "#EF620C"
	}),
	multiValueLabel: baseStyles => ({
		...baseStyles,
		color: "white"
	})
}

const customClasses = {
	control: state => {
		return state.isFocused
			? clsx(selectStyles, "!shadow-none !border !border-primary")
			: clsx(selectStyles, "border !border-[#f2f2f2] !shadow-none")
	},
	indicatorSeparator: () => {
		return "hidden"
	},
	valueContainer: () => {
		return "!p-0"
	},
	menu: () => {
		return "!shadow-none !border !border-primary !rounded-[14px] px-2"
	},
	option: state => {
		if (state.isSelected) {
			return "!text-white !bg-primary !rounded-[14px]"
		}

		if (state.isFocused) {
			return "!bg-[#FFF6F6] !rounded-[14px]"
		}
	}
}

export function SelectInput({
	disabled,
	options,
	placeholder,
	value,
	onChange,
	name,
	label,
	multiSelect = false,
	isSearchable = false,
	className
	// menuTarget
}) {
	return (
		<div className={className}>
			{label && <div className={styles.label}>{label}</div>}
			<Select
				styles={customStyles}
				classNames={customClasses}
				isDisabled={disabled}
				isMulti={multiSelect}
				options={options}
				placeholder={placeholder}
				isSearchable={isSearchable}
				name={name}
				value={value}
				onChange={onChange}
				// menuTarget={menuTarget}
				// menuIsOpen={true}
			/>
		</div>
	)
}

export function CreatableSelectInput({
	disabled,
	options,
	placeholder,
	value,
	onChange,
	name,
	label,
	multiSelect = false,
	isSearchable = true,
	className
	// menuTarget
}) {
	return (
		<div className={className}>
			{label && <div className={styles.label}>{label}</div>}
			<CreatableSelect
				styles={customStyles}
				classNames={customClasses}
				isDisabled={disabled}
				isMulti={multiSelect}
				options={options}
				placeholder={placeholder}
				isSearchable={isSearchable}
				name={name}
				value={value}
				onChange={onChange}
				// menuTarget={menuTarget}
				// menuIsOpen={true}
			/>
		</div>
	)
}
