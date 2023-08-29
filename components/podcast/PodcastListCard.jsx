import clsx from "clsx"
import { useRouter } from "next/router"

export function PodcastListCard({
	podcast,
	editClick,
	deleteClick,
	showButtons,
	link
}) {
	const router = useRouter()

	return (
		<div className="text-sm bg-white rounded-[18px] p-4 flex flex-col gap-y-5">
			<h3
				className={clsx(
					"font-semibold text-primary",
					link && "cursor-pointer"
				)}
				onClick={() =>
					link && router.push(`/${router.asPath}/${podcast._id}`)
				}
			>
				{podcast.name}
			</h3>
			<p>{podcast.description}</p>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Featured</h4>
				<p>{podcast.featured ? "Featured" : "Not Featured"}</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Hosts</h4>
				<p>
					{podcast.hostUsers.map((host, index) => (
						<span key={index}>
							{host.name}{" "}
							{index < podcast.hostUsers.length - 1 ? ", " : ""}
						</span>
					))}
				</p>
			</div>
			<div className="flex flex-col gap-y-[10px]">
				<h4 className="font-semibold">Genre</h4>
				<p>
					{podcast.genre.map((gen, index) => (
						<span key={index}>
							{gen} {index < podcast.genre.length - 1 ? "," : ""}
						</span>
					))}
				</p>
			</div>
			{showButtons && (
				<div className="flex gap-x-[10px]">
					<button
						onClick={editClick}
						className="px-10 py-2 text-white bg-primary rounded-[18px]"
					>
						Edit
					</button>
					<button
						onClick={deleteClick}
						className="px-10 py-2 text-white bg-[#4B5563] rounded-[18px]"
					>
						Delete
					</button>
				</div>
			)}
		</div>
	)
}

export default PodcastListCard
