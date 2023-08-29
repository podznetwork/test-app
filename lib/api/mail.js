// This project uses the nodemailer library to send email
// However, it is recommended to switch over to dedicated email services
// like Mailgun, AWS SES, etc.
import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const nodemailerConfig = process.env.NODEMAILER_CONFIG
// 	? JSON.parse(process.env.NODEMAILER_CONFIG)
// 	: {}

// const transporter = nodemailer.createTransport({
// 	host: "smtp.gmail.com",
// 	port: 465,
// 	secure: true,
// 	auth: {
// 		user: process.env.MAIL_USERNAME,
// 		pass: process.env.MAIL_PASSWORD
// 	},
// 	tls: {
// 		rejectUnauthorized: false
// 	}
// })

export async function sendMail({ from, to, subject, html }) {
	try {
		const msg = {
			from,
			to,
			subject,
			html
		}
		sgMail.send(msg).then(response => {
			console.log("Message sent successfully.")
		})
	} catch (e) {
		console.error(e)
		throw new Error(`Could not send email: ${e.message}`)
	}
}
