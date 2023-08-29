import { ButtonLink } from "@/components/common/Button"
import { Text } from "@/components/common/Text"
import { Container, Spacer, Wrapper } from "@/components/Layout"
import Link from "next/link"
import styles from "./VerifyEmail.module.css"

const VerifyEmail = ({ valid }) => {
	return (
		<Wrapper className={styles.root}>
			<Container column alignItems="center">
				<Text
					className={styles.text}
					color={valid ? "success-light" : "secondary"}
				>
					{valid
						? "Your email has been verified, Please log in."
						: "It looks like you may have clicked on an invalid link. Please close this window and try again."}
				</Text>
				<Spacer size={4} axis="vertical" />
				<Link href="/login" passHref>
					<ButtonLink variant="ghost" type="success" size="large">
						Login
					</ButtonLink>
				</Link>
			</Container>
		</Wrapper>
	)
}

export default VerifyEmail
