import Image from "next/image"
import React from "react"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { editUserData, useUserMutator } from "@/lib/app/user"
import FacebookLogin from "@greatsumini/react-facebook-login"

function getTwitterOauthUrl() {
	const rootUrl = "https://twitter.com/i/oauth2/authorize"
	const options = {
		redirect_uri: `${process.env.NEXT_PUBLIC_WEB_URI}/api/auth/twitter`,
		client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
		state: "state",
		response_type: "code",
		code_challenge: "challenge",
		code_challenge_method: "plain",
		scope: [
			"users.read",
			"tweet.read",
			"follows.read",
			"follows.write"
		].join(" ") // add/remove scopes as needed
	}
	const qs = new URLSearchParams(options).toString()
	return `${rootUrl}?${qs}`
}

function getInstagramOAuthUrl() {
	const rootUrl = "https://www.instagram.com/oauth/authorize"
	const options = {
		client_id: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
		redirect_uri: `${process.env.NEXT_PUBLIC_WEB_URI}/api/auth/instagram`,
		response_type: "code",
		scope: ["user_profile", "user_media"].join(" ")
	}
	const qs = new URLSearchParams(options).toString()
	return `${rootUrl}?${qs}`
}

// function getTiktokOAuthUrl() {
// 	const rootUrl = "https://www.tiktok.com/v2/auth/authorize"
// 	const options = {
// 		client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY,
// 		scope: "user.info.basic",
// 		redirect_uri: `${process.env.NEXT_PUBLIC_WEB_URI}/api/auth/tiktok`,
// 		response_type: "code"
// 	}
// 	const qs = new URLSearchParams(options).toString()
// 	return `${rootUrl}?${qs}`
// }

function SocialLogins({ user }) {
	const userMutator = useUserMutator()

	return (
		<div className="flex flex-col gap-y-5">
			<h4 className="text-xs">Social Networks</h4>
			<div className="text-[#4B5563] flex gap-x-2">
				<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
					<Image
						width={24}
						height={24}
						type="button"
						src="/images/facebook.svg"
						alt="Twitter connect icon"
					/>
					<p className="text-xs">Facebook</p>
				</div>
				<div className="text-black grow">
					<Button
						className="relative w-full h-full"
						variant={buttonVariants.SECONDARY}
						onClick={async () => {
							if (user?.facebookProfile) {
								try {
									await editUserData(user._id, {
										facebookProfile: null
									})
									userMutator.updateUser({
										...user,
										facebookProfile: null
									})
								} catch (e) {
									console.log(e)
								}
							}
						}}
					>
						{user?.facebookProfile ? (
							<>Disconnect</>
						) : (
							<>
								<FacebookLogin
									appId={
										process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
									}
									onProfileSuccess={async response => {
										try {
											await editUserData(user._id, {
												facebookProfile: response.link
											})
											userMutator.updateUser({
												...user,
												facebookProfile: response.link
											})
										} catch (e) {
											console.log(e)
										}
									}}
									scope="public_profile,email,user_link"
									fields="name,email,picture,link"
									loginOptions={{
										auth_type: "rerequest"
									}}
									style={{
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										position: "absolute",
										backgroundColor: "rgba(255,255,255,0)",
										color: "rgba(255,255,255,0)",
										fontSize: "16px",
										padding: "12px 24px",
										border: "none",
										borderRadius: "4px"
									}}
								/>
								Connect
							</>
						)}
					</Button>
				</div>
			</div>
			<div className="text-[#4B5563] flex gap-x-2">
				<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
					<Image
						width={24}
						height={24}
						type="button"
						src="/images/twitter.svg"
						alt="Twitter connect icon"
					/>
					<p className="text-xs">Twitter</p>
				</div>
				<div className="text-black grow">
					{user?.twitterProfile ? (
						<Button
							onClick={async () => {
								try {
									await editUserData(user._id, {
										twitterProfile: null
									})
									userMutator.updateUser({
										...user,
										twitterProfile: null
									})
								} catch (e) {
									console.log(e)
								}
							}}
							variant={buttonVariants.SECONDARY}
							className="relative w-full h-full"
						>
							Disconnect
						</Button>
					) : (
						<a href={getTwitterOauthUrl()}>
							<Button
								className="relative w-full h-full"
								variant={buttonVariants.SECONDARY}
							>
								Connect
							</Button>
						</a>
					)}
				</div>
			</div>
			<div className="text-[#4B5563] flex gap-x-2">
				<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
					<Image
						width={24}
						height={24}
						type="button"
						src="/images/instagram.svg"
						alt="Twitter connect icon"
					/>
					<p className="text-xs">Instagram</p>
				</div>
				<div className="text-black grow">
					{user?.instagramProfile ? (
						<Button
							onClick={async () => {
								try {
									await editUserData(user._id, {
										instagramProfile: null
									})
									userMutator.updateUser({
										...user,
										instagramProfile: null
									})
								} catch (e) {
									console.log(e)
								}
							}}
							variant={buttonVariants.SECONDARY}
							className="relative w-full h-full"
						>
							Disconnect
						</Button>
					) : (
						<a href={getInstagramOAuthUrl()}>
							<Button
								className="relative w-full h-full"
								variant={buttonVariants.SECONDARY}
							>
								Connect
							</Button>
						</a>
					)}
				</div>
			</div>
			{/* <div className="text-[#4B5563] flex gap-x-2">
				<div className="bg-white min-w-[150px] border border-[#f2f2f2] flex items-center py-2 px-6 rounded-[14px] gap-x-2">
					<Image
						width={24}
						height={24}
						type="button"
						src="/images/instagram.svg"
						alt="Twitter connect icon"
					/>
					<p className="text-xs">Tiktok</p>
				</div>
				<div className="text-black grow">
					{user?.instagramProfile ? (
						<Button
							onClick={async () => {
								try {
									await editUserData(user._id, {
										instagramProfile: null
									})
									userMutator.updateUser({
										...user,
										instagramProfile: null
									})
								} catch (e) {
									console.log(e)
								}
							}}
							variant={buttonVariants.SECONDARY}
							className="relative w-full h-full"
						>
							Disconnect
						</Button>
					) : (
						<a href={getTiktokOAuthUrl()}>
							<Button
								className="relative w-full h-full"
								variant={buttonVariants.SECONDARY}
							>
								Connect
							</Button>
						</a>
					)}
				</div>
			</div> */}
		</div>
	)
}

export default SocialLogins
