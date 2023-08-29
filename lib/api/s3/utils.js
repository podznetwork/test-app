import {
	CreateBucketCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	HeadBucketCommand,
	ListObjectsV2Command,
	PutBucketAclCommand,
	PutObjectCommand,
	S3Client
} from "@aws-sdk/client-s3"

export const s3Client = new S3Client({
	region: process.env.S3_REGION,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
	}
})

export async function listObjectsS3(keyPrefix = "") {
	const input = {
		Bucket: process.env.S3_BUCKET_NAME,
		Prefix: keyPrefix
	}

	return await s3Client.send(new ListObjectsV2Command(input))
}

export async function getObjectsS3(keys) {
	return await Promise.all(keys.map(getObjectS3))
}

export async function getObjectS3(key) {
	return await s3Client.send(
		new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key
		})
	)
}

export async function deleteObjectsS3(keys) {
	return await s3Client.send(
		new DeleteObjectsCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Delete: {
				Objects: keys.map(key => ({ Key: key })),
				Quiet: true
			}
		})
	)
}

export async function deleteObjectS3(key) {
	return await s3Client.send(
		new DeleteObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key
		})
	)
}

export async function putObjectsS3(objects) {
	return await Promise.all(objects.map(putObjectS3))
}

export async function putObjectS3(object) {
	return await s3Client.send(
		new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			...object
		})
	)
}

// export async function createS3Bucket() {
// 	if (await checkIfBucketExists()) return
// 	return await s3Client.send(
// 		new CreateBucketCommand({
// 			Bucket: process.env.S3_BUCKET_NAME,
// 			ACL: "public-read"
// 		})
// 	)
// }

// export async function editS3Bucket() {
// 	return await s3Client.send(
// 		new PutBucketAclCommand({
// 			Bucket: process.env.S3_BUCKET_NAME,
// 			ACL: "public-read"
// 		})
// 	)
// }

export async function checkIfBucketExists() {
	try {
		await s3Client.send(
			new HeadBucketCommand({
				Bucket: process.env.S3_BUCKET_NAME
			})
		)
		return true
	} catch (e) {
		return false
	}
}
