import React, { useState } from "react"
import { SectionHeading } from "../common/Typography"
import Image from "next/image"
import { useRouter } from "next/router"
import { Input, Textarea } from "../common/Input"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { CreatableSelectInput, SelectInput } from "../common/Input/SelectInput"
import { useCurrentUser, useUsers } from "@/lib/app/user"
import { genreList } from "@/lib/app/episode"

function AddPodcast() {
	const { user } = useCurrentUser()

	const [logo, setLogo] = useState(null)
	const [host, setHost] = useState([])
	const { users } = useUsers("user")

	const getHostUsers = () => {
		const hosts = []
		for (let i = 0; i < host.length; i++) {
			for (let j = 0; j < users.length; j++) {
				if (host[i]._id === users[j]._id) {
					hosts.push(users[j])
				}
			}
		}
		return hosts
	}

	const getHostUsersOptions = () => {
		const hosts = users.filter(
			user => user.access.includes("host") || user.becomeHost
		)
		const options = hosts.map(host => ({
			value: host._id,
			label: host.name
		}))
		return options
	}

	const getGenreOptions = () => {
		return genreList.map(genre => ({
			label: genre,
			value: genre
		}))
	}

	const router = useRouter()
	return (
		<div className="flex flex-col w-full gap-5 lg:w-1/2">
			<div className="flex flex-row gap-x-2">
				<button
					onClick={() => router.back()}
					className="flex items-center"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading>Add new PODZ</SectionHeading>
			</div>
			<div className="relative">
				<p className="mb-2 text-sm font-semibold">Logo</p>
				<label className="p-2 block w-28 text-sm flex items-center justify-center h-28 border rounded-[18px] border-dashed border-[#4B5563]">
					Upload your photo
					<input
						accept="image/*"
						type="file"
						onChange={e => setLogo(e.target.files[0])}
						className="hidden"
					/>
				</label>
				{/* <div className="absolute bottom-0 bg-white rounded-[18px] ">
					<input
						type="file"
						onChange={e => setLogo(e.target.files[0])}
						className="absolute inset-0 z-10 w-full h-full border-gray-300 rounded-full opacity-0 cursor-pointer"
					/>
					<Image
						className="rounded-[18px]"
						// src={podcast?.profilePicture}
						alt="Profile Picture"
						height={112}
						width={112}
					/>
				</div> */}
				{logo && (
					<div className="flex justify-between text-sm truncate">
						<p>{logo.name}</p>
						<button onClick={() => setLogo(null)}>
							<svg
								className="w-3 h-3"
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
				)}
			</div>
			<div className="flex flex-col gap-y-5">
				<div className="flex items-end gap-x-4">
					<Input
						label="RSS Link"
						className="w-full"
						placeholder="abc/s/1222/podcast"
					/>
					<Button
						className="basis-[200px] h-[50px]"
						variant={buttonVariants.SECONDARY}
					>
						Load RSS Link
					</Button>
				</div>
				<Input
					label="Podcast Name"
					className="w-full"
					placeholder="Sister Sesh Podcast"
				/>
				<Textarea
					label="Podcast Description"
					className="w-full"
					placeholder="Description Text"
				/>
				{users && (
					<CreatableSelectInput
						label="Hosts"
						required
						multiSelect={true}
						options={getHostUsersOptions()}
					/>
				)}
				<SelectInput
					label="Genre"
					required
					multiSelect={true}
					options={getGenreOptions()}
				/>
				<div>
					<p className="mb-2 text-xs font-semibold">Episodes</p>
					<div className="flex flex-col gap-y-[10px] border border-primary bg-white rounded-[14px] px-[15px] py-[20px] text-black max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-white">
						{/* <div className="flex justify-between text-white bg-primary h-[50px] w-[300px] text-xs rounded-[18px] px-[10px] py-[5px] max-h-[25px]">
							<p className="truncate max-w-[250px]">
								HELLOQWEQW EW QEQW EQW
								WEasddddddddddddddddddddda DAW DAWD WAD WAD WAD
								AWD AWD
							</p>
							<button>
								<svg
									className="w-3 h-3"
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
						</div> */}
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-x-9 gap-y-[10px]">
					<Button
						variant={buttonVariants.PRIMARY}
						className="w-full lg:max-w-[240px]"
					>
						Save
					</Button>
					<Button
						variant={buttonVariants.SECONDARY}
						className="w-full lg:max-w-[240px]"
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	)
}

export default AddPodcast
