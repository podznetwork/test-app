import Image from "next/future/image"

const CustomImage = ({ width, height, divClassName, ...rest }) => {
	return (
		<>
			<div
				style={{
					width: "100%",
					position: "relative"
				}}
				className={"flex items-center justify-center " + divClassName}
			>
				<Image
					alt="Default avatar"
					width={width ? width : 180}
					height={height ? height : 100}
					{...rest}
				/>
			</div>
		</>
	)
}

export default CustomImage
