import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const auth = new Hono();

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password, name } = c.req.valid("json");

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return c.json({ message: "User already exists" }, 400);
  }

  const user = await prisma.user.create({
    data: { email, password, name },
  });

  return c.json(
    { user: { id: user.id, email: user.email, name: user.name } },
    201
  );
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return c.json({ message: "Invalid email or password" }, 401);
  }

  return c.json({ user: { id: user.id, email: user.email, name: user.name } });
});

export default auth;
