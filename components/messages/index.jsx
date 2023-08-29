import {
	createConversation,
	sendMessage,
	updateConversationStatus,
	useConversations,
	useConversationsMutator
} from "@/lib/app/conversation"
import { useCurrentUser, useUsers } from "@/lib/app/user"
import { useEffect, useRef, useState } from "react"
import Spinner from "../common/Spinner"
import { SectionHeading } from "../common/Typography"
import clsx from "clsx"
import Image from "next/image"
import { Input, Textarea } from "../common/Input"
import { fuzzySearch } from "@/lib/app/utils"
import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import { buttonVariants } from "../common/Button/Button"
import { useSWRConfig } from "swr"
import { useErrorContext } from "../ContextProviders/ErrorContextProvider"

function NewMessageview({
	currentUser,
	setShowNewMessageView,
	conversations,
	setConversation
}) {
	const [searchFilter, setSearchFilter] = useState("")
	const [showModal, setShowModal] = useState(false)
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const [selectedUser, setSelectedUser] = useState(null)
	const [loading, setLoading] = useState(false)
	const { mutate } = useSWRConfig()
	const messageRef = useRef()
	const { users } = useUsers()
	const options = {
		includeScore: false,
		threshold: 0.2,
		keys: ["name"]
	}

	const availableConversationUsers = new Set()
	conversations?.forEach(conversation => {
		availableConversationUsers.add(conversation.senderId)
		availableConversationUsers.add(conversation.receiverId)
	})

	const availableUsers = users?.filter(user => {
		return (
			!availableConversationUsers.has(user._id) &&
			user.allowMessages &&
			user._id !== currentUser._id
		)
	})

	const filteredUsers = fuzzySearch(availableUsers, searchFilter, options)

	const onSubmit = async e => {
		e.preventDefault()
		try {
			setLoading(true)
			const conversation = await createConversation({
				receiverId: selectedUser._id,
				message: messageRef.current.value
			})
			setConversation(conversation)
			mutate("/api/conversations")
			setSuccessMessage("Message sent successfully.")
			setLoading(false)
			setShowModal(false)
			setShowNewMessageView(false)
		} catch (e) {
			setLoading(false)
			setErrorMessage(e.message)
		}
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-row w-full gap-x-2">
				<button
					onClick={() => setShowNewMessageView(false)}
					className="flex items-center shrink-0"
				>
					<Image
						src="/images/backArrow.svg"
						height={20}
						width={20}
						alt="Go Back"
					/>
				</button>
				<SectionHeading>
					Please select who you would like to message
				</SectionHeading>
			</div>
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<div className="flex flex-col gap-5">
						<h3 className="text-lg font-[500px]">Send Message</h3>
						<Textarea ref={messageRef} placeholder="Text Message" />
						<Button
							onClick={onSubmit}
							variant={buttonVariants.PRIMARY}
							className="mx-auto min-w-[180px]"
						>
							Send
						</Button>
					</div>
				</Modal>
			)}
			<Input
				placeholder="Search by name"
				value={searchFilter}
				onChange={e => setSearchFilter(e.target.value)}
			/>
			<div className="flex flex-col gap-2">
				{filteredUsers?.map(user => (
					<div
						onClick={() => {
							setSelectedUser(user)
							setShowModal(true)
						}}
						key={user._id}
						className="bg-white rounded-[18px] flex gap-4 p-2 hover:bg-primary-50 cursor-pointer"
					>
						<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-200">
							{user.profilePicture ? (
								<img
									className="w-full h-full rounded-full"
									src={user.profilePicture}
								/>
							) : (
								user.name[0]
							)}
						</div>
						<div className="flex items-center text-sm">
							{user.name}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

function ContactBox({
	conversation,
	currentUser,
	setReceiver,
	setConversation,
	active,
	setLoading,
	messageContainerRef,
	contactsContainerRef
}) {
	const { setErrorMessage } = useErrorContext()
	const selectConversation = async () => {
		try {
			messageContainerRef.current.classList.remove("hidden")
			messageContainerRef.current.classList.add("flex")
			contactsContainerRef.current.classList.remove("flex")
			contactsContainerRef.current.classList.add("hidden")
			setLoading(true)
			fetch(`/api/conversations/${conversation._id}`)
				.then(response => response.json())
				.then(data => {
					setConversation(data)
				})
			setLoading(false)
		} catch (e) {
			setErrorMessage(e.message)
			setLoading(false)
		}
	}

	const receiver =
		conversation.senderId === currentUser?._id
			? conversation.receiver
			: conversation.sender

	return (
		receiver && (
			<button
				onClick={() => {
					setReceiver(receiver)
					selectConversation()
				}}
				className={clsx(
					"flex border-b border-[#f2f2f2] flex-row items-center px-8 py-4 first:rounded-tr-[14px] first:rounded-tl-[14px]",
					active ? "lg:bg-primary-100" : "hover:bg-primary-50"
				)}
			>
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-200">
					{receiver.profilePicture ? (
						<img
							className="w-full h-full rounded-full"
							src={receiver.profilePicture}
						/>
					) : (
						receiver.name[0]
					)}
				</div>
				<div className="ml-2 text-sm font-semibold">
					{receiver.name}
				</div>
				{conversation.newMessage && (
					<div className="flex items-center justify-center w-2 h-2 ml-auto text-xs leading-none text-white bg-red-500 rounded-full"></div>
				)}
			</button>
		)
	)
}

function Message({ message, receiver, currentUser }) {
	const self = message.senderId === currentUser._id

	return self ? (
		<div className="col-start-1 col-end-13 p-3 rounded-lg lg:col-end-8">
			<div className="flex flex-row items-center justify-start">
				<div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-primary-100">
					{currentUser.profilePicture ? (
						<img
							src={currentUser.profilePicture}
							className="w-full h-full rounded-full"
						/>
					) : (
						currentUser.name[0]
					)}
				</div>
				<div className="relative px-4 py-2 ml-3 text-sm shadow bg-primary-100 rounded-xl">
					<div>{message.message}</div>
				</div>
			</div>
		</div>
	) : (
		<div className="col-start-1 col-end-13 p-3 rounded-lg lg:col-start-6">
			<div className="flex flex-row-reverse items-center">
				<div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-[#FEF9F9]">
					{receiver.profilePicture ? (
						<img
							src={receiver.profilePicture}
							className="w-full h-full rounded-full"
						/>
					) : (
						receiver.name[0]
					)}
				</div>
				<div className="relative px-4 py-2 mr-3 text-sm bg-[#FEF9F9] rounded-xl">
					<div>{message.message}</div>
				</div>
			</div>
		</div>
	)
}

function MessageContainer() {
	const { setErrorMessage } = useErrorContext()
	const contactsContainerRef = useRef()
	const messageContainerRef = useRef()
	const [loading, setLoading] = useState(false)
	const [receiver, setReceiver] = useState(null)
	const [conversation, setConversation] = useState(null)
	const [conversations, setConversations] = useState([])
	const [conversationFetcher, setConversationFetcher] = useState(null)
	const conversationsMutator = useConversationsMutator()
	const { conversations: fetchedConversations } = useConversations()
	const { user } = useCurrentUser()
	const [showNewMessageView, setShowNewMessageView] = useState(false)
	const messageRef = useRef()
	const messageScrollRef = useRef()
	const { mutate } = useSWRConfig()

	useEffect(async () => {
		if (conversation) {
			messageScrollRef?.current?.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "start"
			})
			if (conversationFetcher) {
				clearInterval(conversationFetcher)
			}

			const conversationFetch = setInterval(() => {
				if (conversation && conversation._id) {
					fetch(`/api/conversations/${conversation._id}`)
						.then(response => response.json())
						.then(data => {
							if (
								conversation.messages.length !==
								data.messages.length
							) {
								setConversation(data)
							}
						})
				}
			}, 5000)

			setConversationFetcher(conversationFetch)

			if (
				conversation.senderNewMessage ||
				conversation.receiverNewMessage
			) {
				console.log("HELO")
				try {
					const updatedConversation = await updateConversationStatus(
						conversation._id,
						{
							status: false
						}
					)
					mutate("/api/conversations/count")
					conversationsMutator.updateConversation(updatedConversation)
				} catch (e) {
					setErrorMessage(e.message)
				}
			}

			return () => {
				clearInterval(conversationFetcher)
			}
		}
	}, [conversation])

	const onSubmit = async e => {
		e.preventDefault()
		try {
			if (conversation && messageRef.current.value !== "") {
				const updatedConversation = await sendMessage(
					conversation._id,
					{
						message: messageRef.current.value
					}
				)
				setConversation(updatedConversation)
				messageRef.current.value = ""
			}
		} catch (e) {
			setErrorMessage(e.message)
		}
	}

	useEffect(() => {
		const conversationsFetch = setInterval(() => {
			fetch(`/api/conversations/new-conversations`)
				.then(response => response.json())
				.then(data => {
					if (data.length > 0) {
						setConversations(data)
					}
				})
		}, 5000)

		if (fetchedConversations) {
			setConversations(fetchedConversations)
		}

		return () => {
			clearInterval(conversationsFetch)
		}
	}, [fetchedConversations])

	return showNewMessageView ? (
		<NewMessageview
			currentUser={user}
			setConversation={setConversation}
			conversations={conversations}
			setShowNewMessageView={setShowNewMessageView}
		/>
	) : (
		<>
			<div className="flex flex-row mb-5 gap-x-2">
				{conversation && (
					<button
						className="flex items-center lg:hidden"
						onClick={() => {
							if (
								contactsContainerRef.current.classList.contains(
									"hidden"
								)
							) {
								contactsContainerRef.current.classList.remove(
									"hidden"
								)
								messageContainerRef.current.classList.add(
									"hidden"
								)
								setConversation(null)
							}
						}}
					>
						<Image
							src="/images/backArrow.svg"
							height={20}
							width={20}
							alt="Go Back"
						/>
					</button>
				)}
				<SectionHeading
					button="New Message"
					buttonOnClick={() => setShowNewMessageView(true)}
				>
					Messages
				</SectionHeading>
			</div>
			{conversations && conversations.length > 0 ? (
				<div className="flex mt-6 antialiased text-gray-800 message-container">
					<div className="flex flex-row w-full h-full overflow-x-hidden gap-x-4">
						<div
							ref={contactsContainerRef}
							className="flex lg:flex flex-col flex-shrink-0 w-64 bg-white rounded-[14px] grow lg:grow-0 border border-[#f2f2f2]"
						>
							{/* <div className="flex flex-row items-center justify-center w-full h-12">
							<div className="flex items-center justify-center w-10 h-10 rounded-2xl text-primary-700 bg-primary-100">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
									></path>
								</svg>
							</div>
							<div className="ml-2 text-2xl font-bold">
								PodzChat
							</div>
						</div> */}

							<div className="flex flex-col">
								{/* <div className="flex flex-row items-center justify-between text-xs">
								<span className="font-bold">
									Active Conversations
								</span>
								<span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary-200">
									{conversations?.length}
								</span>
							</div> */}
								<div className="flex flex-col overflow-y-auto">
									{conversations?.map(thisConversation => (
										<ContactBox
											messageContainerRef={
												messageContainerRef
											}
											contactsContainerRef={
												contactsContainerRef
											}
											loading={loading}
											setLoading={setLoading}
											key={thisConversation._id}
											setConversation={setConversation}
											setReceiver={setReceiver}
											currentUser={user}
											conversation={thisConversation}
											active={
												thisConversation._id ===
												conversation?._id
											}
										/>
									))}
								</div>
							</div>
						</div>
						<div
							ref={messageContainerRef}
							className="flex-col flex-auto hidden h-full lg:flex"
						>
							<div className="flex flex-col flex-auto flex-shrink-0 h-full p-4 bg-white rounded-[14px]">
								<div className="flex flex-col h-full mb-4 overflow-x-auto">
									<div className="flex flex-col h-full">
										{loading ? (
											<Spinner />
										) : (
											<div className="grid grid-cols-12 gap-y-2">
												{conversation?.messages?.map(
													message => (
														<Message
															key={
																message.messageId
															}
															message={message}
															receiver={receiver}
															currentUser={user}
														/>
													)
												)}
												<div
													ref={messageScrollRef}
													className="h-1 col-start-6 col-end-13 p-3 rounded-lg"
												></div>
											</div>
										)}
									</div>
								</div>
								{conversation && (
									<div className="flex flex-row items-center w-full h-14 px-4 bg-white rounded-[14px] border border-[#f2f2f2]">
										<input
											ref={messageRef}
											type="text"
											className="flex w-full h-10 pl-4 rounded-xl focus:outline-none"
										/>

										<button
											onClick={onSubmit}
											className="flex items-center"
										>
											<Image
												alt="Send Button"
												src="/images/send.svg"
												height={24}
												width={24}
											/>
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex bg-white rounded-[14px] min-h-[600px] items-center justify-center">
					Currenly, there are no messages to show.
				</div>
			)}
		</>
	)
}

export default MessageContainer
