const { MongoClient, ObjectId } = require("mongodb")

const URL = "mongodb://127.0.0.1:27017"
const DBNAME = "podz"

async function updateUserRequestHostField(db) {
	const requests = await db.collection("requests").find({}).toArray()

	await Promise.all(
		requests.map(async request => {
			const newHosts = []
			request?.hosts?.map(host => {
				if (typeof host === "string") {
					newHosts.push({
						_id: host,
						name: host
					})
				}
			})

			await db.collection("requests").findOneAndUpdate(
				{ _id: new ObjectId(request._id) },
				{
					$set: {
						hosts: newHosts
					}
				}
			)
		})
	)
}

;(async function run() {
	const client = new MongoClient(URL)
	await client.connect()
	const db = client.db(DBNAME)
	await updateUserRequestHostField(db)
	console.log("Migration ran successfully.")
})()
