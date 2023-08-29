import { Button } from "../Button"
import { buttonVariants } from "../Button/Button"
import clsx from "clsx"

export function DeleteConfirmationModal({
	heading,
	message,
	onClose,
	onConfirm,
	confirmButton,
	confirmButtonClassName,
	loading
}) {
	return (
		<div
			className="overflow-x-hidden overflow-y-auto fixed left-0 right-0 inset-0 z-50 justify-center items-center h-modal sm:h-full flex bg-[rgba(117,117,117,0.5)]"
			id="add-user-modal"
			aria-modal="true"
			role="dialog"
		>
			<div className="flex items-center justify-center relative w-full h-full max-w-[350px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[750px] px-4 md:h-auto">
				<div className="flex flex-col justify-center items-center relative bg-white rounded-[14px] w-full">
					<div className="flex items-start justify-between w-full p-5 pb-0">
						<h3 className="text-xl font-semibold">{heading}</h3>
						<button
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
							data-modal-toggle="add-user-modal"
							onClick={onClose}
						>
							<svg
								className="w-6 h-6"
								fill="black"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
					</div>
					<div className="w-4/5 pb-5 md:w-3/5">
						<div>
							<div className="pb-6 text-center">
								<p>{message}</p>
							</div>
						</div>

						<div className="flex flex-col items-center justify-center md:flex-row gap-7">
							<Button
								loading={loading}
								onClick={onConfirm}
								variant={
									confirmButtonClassName
										? null
										: buttonVariants.PRIMARY
								}
								className={clsx(
									"w-full md:w-[180px]",
									confirmButtonClassName
								)}
							>
								{confirmButton ?? "Delete"}
							</Button>
							<Button
								loading={loading}
								onClick={onClose}
								variant={buttonVariants.SECONDARY}
								className="w-full md:w-[180px]"
							>
								Cancel
							</Button>
							{/* <button
								onClick={onConfirm}
								className="text-white bg-primary-600 ml-4 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
								type="submit"
							>
								{loading ? (
									<LoadingDots />
								) : (
									<span>Confirm</span>
								)}
							</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function Modal({ heading, onClose, children, noCancel }) {
	return (
		<div
			className="overflow-x-hidden overflow-y-auto fixed left-0 right-0 inset-0 z-[200] justify-center items-center h-modal sm:h-full flex bg-[rgba(117,117,117,0.5)]"
			id="add-user-modal"
			aria-modal="true"
			role="dialog"
		>
			<div className="flex items-center justify-center relative w-full h-full max-w-[350px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[750px] px-4 md:h-auto">
				<div className="flex flex-col justify-center items-center relative bg-white rounded-[14px] w-full">
					{noCancel ? (
						<div className="p-5"></div>
					) : (
						<div className="flex items-start justify-between w-full p-5 pb-0">
							<h3 className="text-xl font-semibold">{heading}</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
								data-modal-toggle="add-user-modal"
								onClick={onClose}
							>
								<svg
									className="w-6 h-6"
									fill="black"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									></path>
								</svg>
							</button>
						</div>
					)}
					<div className="w-4/5 pb-5">{children}</div>
				</div>
			</div>
		</div>
	)
}

export function ModalContainer({
	children,
	maxWidth = 500,
	className,
	wrapperClassName
}) {
	return (
		<div
			className={clsx(
				"fixed flex z-[1000] top-0 left-0 right-0 bottom-0 bg-[rgba(17,29,64,0.3)] flex-cc justify-center items-center",
				wrapperClassName
			)}
		>
			<div
				className={clsx(
					"rounded-[14px] bg-white w-[80%] sm:w-[60%] py-6 shadow-[rgba(0,0,0,0.25)] border border-[#f2f2f2]",
					className
				)}
				style={{ maxWidth }}
			>
				{children}
			</div>
		</div>
	)
}

export function ModalMain({ children, className }) {
	return (
		<div
			className={clsx(
				"max-h-[70vh] pl-6 pr-5 mr-1 overflow-y-auto",
				className
			)}
		>
			{children}
		</div>
	)
}

export function ModalHeader({ headingText, headingSize = 18, onClose }) {
	return (
		<div className="flex px-6 mb-5">
			<h1
				className="text-xl font-semibold leading-[18px]"
				style={{ fontSize: headingSize }}
			>
				{headingText}
			</h1>
			<button className="block ml-auto" onClick={onClose}>
				<svg
					className="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					></path>
				</svg>
			</button>
		</div>
	)
}

export function ButtonsContainer({ children, id, className }) {
	return (
		<div
			id={id}
			className={clsx("px-6 flex-c gap-2 mt-3 justify-end", className)}
		>
			{children}
		</div>
	)
}
