import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/auth";
import { createRouter } from "../lib/hono";
import { minioClient, BUCKET_NAME } from "../lib/minio";

const files = createRouter();

files.get("/public/:fileId", async (c) => {
  const fileId = c.req.param("fileId");

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return c.json({ error: "File not found" }, 404);
  }

  if (!file.isPublic) {
    return c.json({ error: "File is private" }, 403);
  }

  const url = await minioClient.presignedGetObject(
    BUCKET_NAME,
    file.key,
    7 * 24 * 60 * 60
  );

  return c.json({
    file: {
      id: file.id,
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
      url,
    },
  });
});

files.use("/*", jwt({ secret: process.env.JWT_SECRET! }));

files.get("/", async (c) => {
  const { userId } = getCurrentUser(c);

  const userFiles = await prisma.file.findMany({
    where: { userId },
    include: { folder: true },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ files: userFiles });
});

files.get("/folders", async (c) => {
  const { userId } = getCurrentUser(c);

  const folders = await prisma.folder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ folders });
});

const createFolderSchema = z.object({
  name: z.string().min(1).max(255),
  parentId: z.string().optional(),
});

files.post("/folders", zValidator("json", createFolderSchema), async (c) => {
  const { userId } = getCurrentUser(c);
  const { name, parentId } = c.req.valid("json");

  const folder = await prisma.folder.create({
    data: {
      name,
      parentId: parentId || null,
      userId,
    },
  });

  return c.json({ folder }, 201);
});

files.post("/upload", async (c) => {
  const { userId } = getCurrentUser(c);

  const body = await c.req.parseBody();
  const file = body["file"];

  if (!file || !(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  const fileName = file.name;
  const fileSize = file.size;
  const mimeType = file.type;
  const folderId = body["folderId"] as string | undefined;

  const fileKey = `${userId}/${crypto.randomUUID()}-${fileName}`;

  const buffer = await file.arrayBuffer();

  await minioClient.putObject(
    BUCKET_NAME,
    fileKey,
    Buffer.from(buffer),
    fileSize,
    { "Content-Type": mimeType }
  );

  const url = await minioClient.presignedGetObject(
    BUCKET_NAME,
    fileKey,
    7 * 24 * 60 * 60
  );

  const dbFile = await prisma.file.create({
    data: {
      name: fileName,
      size: fileSize,
      mimeType,
      key: fileKey,
      url,
      folderId: folderId || null,
      userId,
    },
  });

  return c.json({ file: dbFile }, 201);
});

files.get("/:fileId/download", async (c) => {
  const { userId } = getCurrentUser(c);
  const fileId = c.req.param("fileId");

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return c.json({ error: "File not found" }, 404);
  }

  if (file.userId !== userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const url = await minioClient.presignedGetObject(
    BUCKET_NAME,
    file.key,
    60 * 60
  );

  return c.json({ url });
});

files.delete("/:fileId", async (c) => {
  const { userId } = getCurrentUser(c);
  const fileId = c.req.param("fileId");

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return c.json({ error: "File not found" }, 404);
  }

  if (file.userId !== userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  await minioClient.removeObject(BUCKET_NAME, file.key);

  await prisma.file.delete({
    where: { id: fileId },
  });

  return c.json({ message: "File deleted successfully" });
});

files.patch("/:fileId/toggle-public", async (c) => {
  const { userId } = getCurrentUser(c);
  const fileId = c.req.param("fileId");

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return c.json({ error: "File not found" }, 404);
  }

  if (file.userId !== userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const updatedFile = await prisma.file.update({
    where: { id: fileId },
    data: { isPublic: !file.isPublic },
  });

  return c.json({ file: updatedFile });
});

export default files;
