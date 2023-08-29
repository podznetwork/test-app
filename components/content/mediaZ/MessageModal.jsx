import { useErrorContext } from "@/components/ContextProviders/ErrorContextProvider"
import { Button } from "@/components/common/Button"
import { buttonVariants } from "@/components/common/Button/Button"
import { Textarea } from "@/components/common/Input"
import { Modal } from "@/components/common/Modal"
import { sendAdminMessage } from "@/lib/app/conversation"
import React, { useRef, useState } from "react"
import { useSWRConfig } from "swr"

function MessageModal({ setShowMessageModal }) {
	const { mutate } = useSWRConfig()
	const [sendMessageModal, setSendMessageModal] = useState(false)
	const { setSuccessMessage, setErrorMessage } = useErrorContext()
	const [loading, setLoading] = useState(false)
	const messageRef = useRef()
	const onSubmit = async e => {
		e.preventDefault()
		try {
			setLoading(true)
			mutate("/api/conversations")
			await sendAdminMessage({ message: messageRef.current.value })
			setSuccessMessage("Message sent Successfully.")
			setLoading(false)
			setSendMessageModal(false)
			setShowMessageModal(false)
		} catch (e) {
			setLoading(false)
			setErrorMessage(e.message)
		}
	}

	return (
		<Modal onClose={() => setShowMessageModal(false)}>
			<div className="flex flex-col gap-5">
				{sendMessageModal ? (
					<>
						<h3 className="text-lg font-[500px]">Send Message</h3>
						<Textarea ref={messageRef} placeholder="Text Message" />
						<Button
							onClick={onSubmit}
							variant={buttonVariants.PRIMARY}
							className="mx-auto min-w-[180px]"
						>
							Send
						</Button>
					</>
				) : (
					<>
						<p className="text-center">
							Would you like to message admin about new media?
						</p>
						<div className="flex flex-col items-center justify-center md:flex-row gap-7">
							<Button
								onClick={() => setSendMessageModal(true)}
								variant={buttonVariants.PRIMARY}
								className="w-full md:w-[180px]"
							>
								Message
							</Button>
							<Button
								onClick={() => setShowMessageModal(false)}
								variant={buttonVariants.SECONDARY}
								className="w-full md:w-[180px]"
							>
								Cancel
							</Button>
						</div>
					</>
				)}
			</div>
		</Modal>
	)
}

export default MessageModal
