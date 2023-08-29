const { MongoClient, ObjectId } = require("mongodb")

const URL =
	"mongodb+srv://staging:Zt9MYf6Q8emBB8do@podz-staging.t8hxk1b.mongodb.net/?retryWrites=true&w=majority"
const DBNAME = "test"

async function updateUserRequestHostField(db) {
	const podcasts = await db.collection("podcasts").find({}).toArray()

	await Promise.all(
		podcasts.map(async podcast => {
			let uId = podcast.name.split(" ").join("_").toLowerCase()

			await db.collection("podcasts").findOneAndUpdate(
				{ _id: new ObjectId(podcast._id) },
				{
					$set: {
						uId
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
