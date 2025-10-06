import { Client } from 'minio'

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
})

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME!

export const ensureBucketExists = async () => {
  const exists = await minioClient.bucketExists(BUCKET_NAME)

  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
    console.log(`✅ Bucket ${BUCKET_NAME} created`)
  }
}
