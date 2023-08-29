import clsx from "clsx"

const ToggleButton = ({ label, onChange, checked, className, required }) => {
	return (
		<div className="flex items-center border border-[#f2f2f2] bg-white rounded-[14px] p-4">
			<p className="grow">{label}</p>
			<label
				className={clsx(
					"relative inline-flex items-center cursor-pointer",
					className
				)}
			>
				<input
					type="checkbox"
					checked={checked}
					onChange={onChange}
					required={required}
					className="sr-only peer"
				/>
				<div className="w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
			</label>
		</div>
	)
}

export default ToggleButton
