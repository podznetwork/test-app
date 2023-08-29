import { isDateType } from "@/lib/app/utils"
import clsx from "clsx"
import { format, isDate } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Table({
	className,
	heading,
	headers,
	fields,
	buttons,
	buttonFunctions,
	buttonConditions,
	link,
	linkParent,
	data,
	onRowClick
}) {
	const filteredData = () => {
		const newData = []
		data?.forEach(item => {
			const obj = new Object()
			for (var i = 0; i < headers.length; i++) {
				obj[headers[i]] = item[fields[i]] ?? ""
			}
			obj._id = item._id ?? ""
			newData.push(obj)
		})

		return newData
	}

	const router = useRouter()

	const formatCell = data => {
		if (isDateType(data)) {
			return <>{format(new Date(data), "yyyy-MM-dd' 'HH:mm:ss")}</>
		}

		return <>{data}</>
	}

	return (
		<>
			<div
				className={`relative overflow-x-auto rounded-[14px] text-sm ${className}`}
			>
				<table className="w-full text-sm text-left dark:text-gray-400">
					<thead className="text-sm text-gray-700 capitalize bg-white dark:bg-gray-700 dark:text-gray-400">
						<tr>
							{headers?.map((header, index) => (
								<th
									key={index}
									scope="col"
									className="px-6 py-3 font-normal"
								>
									<div className="flex items-center">
										{header}
										{/* <a href="">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-3 h-3 ml-1"
												aria-hidden="true"
												fill="currentColor"
												viewBox="0 0 320 512"
											>
												<path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"></path>
											</svg>
										</a> */}
									</div>
								</th>
							))}
							{buttons?.map((button, index) => (
								<th
									key={index}
									scope="col"
									className="px-6 py-3 cursor-pointer"
								>
									{/* <span className="sr-only">{button}</span> */}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredData()?.map((item, idx) => (
							<tr
								onClick={
									onRowClick ? () => onRowClick(item) : null
								}
								key={item._id}
								className="bg-white even:bg-[#FFF6F6] dark:bg-gray-800 dark:border-gray-700"
							>
								{Object.keys(item)?.map((key, itemIndex) =>
									typeof item[key] === "boolean" ? (
										<td
											key={idx}
											className="px-6 py-4 align-baseline"
										>
											{item[key] ? (
												<span>
													{key[0].toUpperCase() +
														key.substring(1)}
												</span>
											) : (
												<span className="text-[#E55C5C]">
													Not{" "}
													{key[0].toUpperCase() +
														key.substring(1)}
												</span>
											)}
										</td>
									) : typeof item[key] === "object" ? (
										<td className="px-6 py-4 align-baseline">
											{item[key]?.map((item, i) =>
												typeof item === "object" ? (
													<span
														className="capitalize"
														key={item._id}
													>
														{item.name} <br />
													</span>
												) : (
													<span
														className="capitalize"
														key={i}
													>
														{i === 0
															? item
															: ", " + item}
													</span>
												)
											)}
										</td>
									) : key === "_id" ? null : (
										<td className="px-6 py-4 max-w-[400px] max-h-[400px] align-baseline break-words">
											{itemIndex === 0 && link ? (
												<Link
													href={
														linkParent
															? `${linkParent}/${item._id}`
															: `${router.asPath}/${item._id}`
													}
													passHref
												>
													<div className="flex font-semibold cursor-pointer gap-x-2">
														{item[key]}
														<div className="flex items-center justify-center shrink-0">
															<Image
																className="shrink-0"
																src="/images/link.svg"
																height={14}
																width={14}
																alt="Link to Podcast"
															/>
														</div>
													</div>
												</Link>
											) : (
												<div
													className={clsx(
														"line-clamp-4",
														itemIndex === 0 &&
															"font-semibold"
													)}
												>
													{formatCell(item[key])}
												</div>
											)}
										</td>
									)
								)}
								{buttons?.map((button, index) =>
									typeof button === "object" ? (
										buttonConditions ? (
											buttonConditions[index](
												data[idx]
											) ? (
												<td
													key={index}
													onClick={() =>
														buttonFunctions[index](
															data[idx]
														)
													}
													className={clsx(
														"justify-center px-2 py-4 align-baseline cursor-pointer textRight w-[100px]",
														buttons.length === 1 &&
															"pr-6"
													)}
												>
													<div
														className={clsx(
															"flex gap-x-1 max-w-fit mx-auto",
															index === 0 &&
																"ml-auto mr-0",
															index ===
																buttons.length -
																	1 &&
																"mr-auto ml-0"
														)}
													>
														{button.label && (
															<span>
																{button.label}
															</span>
														)}
														{button.icon &&
															button.icon}
													</div>
												</td>
											) : (
												<td></td>
											)
										) : (
											<td
												key={index}
												onClick={() =>
													buttonFunctions[index](
														data[idx]
													)
												}
												className={clsx(
													"justify-center px-2 py-4 align-baseline cursor-pointer textRight w-[100px]",
													buttons.length === 1 &&
														"pr-6"
												)}
											>
												<div
													className={clsx(
														"flex gap-x-1 max-w-fit mx-auto",
														index === 0 &&
															"ml-auto mr-0",
														index ===
															buttons.length -
																1 &&
															"mr-auto ml-0"
													)}
												>
													{button.label && (
														<span>
															{button.label}
														</span>
													)}
													{button.icon && button.icon}
												</div>
											</td>
										)
									) : (
										<td
											key={index}
											onClick={() =>
												buttonFunctions[index](
													data[idx]
												)
											}
											className="px-6 py-4 align-baseline cursor-pointer textRight"
										>
											<a className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
												{button}
											</a>
										</td>
									)
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	)
}
