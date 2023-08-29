import CustomImage from "@/components/CustomImage/CustomImage"

const Spinner = () => {
	return (
		<div className="h-screen bg-white">
			<div className="flex justify-center items-center h-full">
				<CustomImage
					src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
					width={32}
					height={32}
					className="mx-auto"
					alt="Spinner"
				/>
			</div>
		</div>
	)
}

export default Spinner
