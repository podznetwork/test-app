const { MongoClient, ObjectId } = require("mongodb")

const URL = "mongodb://127.0.0.1:27017"

async function updateUserBecomeHostField(db) {
	const users = await db
		.collection("users")
		.find({
			becomeHost: {
				$exists: false
			}
		})
		.toArray()

	const admin = await db.collection("users").findOne({
		access: "admin"
	})

	await Promise.all(
		users.map(async user => {
			if (!user.access.includes("admin")) {
				await db.collection("users").findOneAndUpdate(
					{
						_id: ObjectId(user._id)
					},
					{
						$set: {
							becomeHost: true
						}
					}
				)
				await db.collection("conversations").findOneAndUpdate(
					{ senderId: new ObjectId(admin._id) },
					{
						$set: {
							receiverId: new ObjectId(user._id),
							newMessage: true
						},
						$push: {
							messages: {
								messageId: new ObjectId(),
								senderId: new ObjectId(admin._id),
								message:
									"We have automatically updated your host status as part of an update to Podz Network. Consequently, the podcast owners will automatically be able to send host requests to you. If you want to turn this feature off, please find the option to do so in settings on your dashboard."
							}
						}
					},
					{
						upsert: true
					}
				)

				// await sendMail({
				// 	to: user.email,
				// 	from: process.env.FROM_EMAIL,
				// 	subject: "Host status updated on Podz Network.",
				// 	html: `
				//     <div>
				//     <p>Hello, ${user.name}</p>

				//     <p>We have automatically updated your host status as part of an update to Podz Network. Consequently, the podcast owners will automatically be able to send host requests to you.</p>

				//     <p>If you want to turn this feature off, please find the option to do so in settings on your dashboard.</p>

				//     <p>If you have any questions or concerns, please do not hesitate to contact us.</p>

				//     <p>Best regards,</p>

				//     <p>Podz Network Team</p>
				//   </div>
				//     `
				// })
			}
		})
	)
}

;(async function run() {
	const client = new MongoClient(URL)
	await client.connect()
	const db = client.db("podz")
	await updateUserBecomeHostField(db)
	console.log("Migration ran successfully.")
})()
