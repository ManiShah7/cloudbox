import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/auth";
import { createRouter } from "../lib/hono";

const files = createRouter();

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

export default files;
