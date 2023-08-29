import { Button } from "../common/Button"
import { Input } from "../common/Input"
import { Wrapper } from "../Layout"

const Intro = () => {
	return (
		<div className="bg-[#FFEDD5] text-[#4B5563] pb-16">
			<Wrapper>
				<div className="">
					<div>
						<img
							className="-translate-x-12"
							src="./images/podz_logo.png"
							alt="podz logo"
						/>
					</div>
					<div className="flex -translate-y-16">
						<div className="w-3/6 pr-40">
							<h2 className="text-4xl font-semibold">
								Share, discover and discuss. Find your voice, &
								join the conversation.
							</h2>
							<p className="mt-8 text-lg">
								We believe in the power of storytelling, and
								we're here to help talented, up-and-coming
								podcasters share their stories.
							</p>
							<h3 className="mt-8 text-lg font-semibold">
								Join the waitlist for early access
							</h3>
							<div className="mt-4 gap-x-4 flex w-full">
								<Input
									placeholder="Email Address"
									className="w-4/6"
								/>
								<Button className="bg-[#FB923C] text-[#FFFFFF] border-0 w-2/6">
									Join
								</Button>
							</div>
						</div>
						<div className="w-3/6">
							<img src="./images/clip_art.png" alt="podz logo" />
						</div>
					</div>
				</div>
			</Wrapper>
		</div>
	)
}

export default Intro
