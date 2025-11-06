import { Client } from 'minio'

let minioClientInstance: Client | null = null

export const getMinioClient = () => {
  if (!minioClientInstance) {
    minioClientInstance = new Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!
    })
  }
  return minioClientInstance
}

// Lazy initialization - will be created on first access
export const minioClient = new Proxy({} as Client, {
  get: (target, prop) => {
    const client = getMinioClient()
    return (client as any)[prop]
  }
})

export const getBucketName = () => process.env.MINIO_BUCKET_NAME || 'cloudbox'

export const ensureBucketExists = async () => {
  const client = getMinioClient()
  const bucketName = getBucketName()
  const exists = await client.bucketExists(bucketName)

  if (!exists) {
    await client.makeBucket(bucketName, 'us-east-1')
    console.log(`Bucket ${bucketName} created`)
  }
}
