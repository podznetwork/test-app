import { Wrapper } from "@/components/Layout"
import MessageContainer from "@/components/messages"
import { userRoles } from "@/lib/app/user"
import Head from "next/head"

const ChatPage = () => {
	return (
		<>
			<Head>
				<title>Messages</title>
			</Head>
			<Wrapper>
				<MessageContainer />
			</Wrapper>
		</>
	)
}

ChatPage.routeProtector = [
	userRoles.USER,
	userRoles.GUEST,
	userRoles.OWNER,
	userRoles.HOST,
	userRoles.ADMIN
]

export default ChatPage
