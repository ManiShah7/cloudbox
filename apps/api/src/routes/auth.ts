import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { createRouter } from "../lib/hono";

const auth = createRouter();

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const token = await sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!
  );

  return c.json(
    { user: { id: user.id, email: user.email, name: user.name }, token },
    201
  );
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return c.json({ message: "Invalid email or password" }, 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password!);

  if (!passwordMatch) {
    return c.json({ message: "Invalid email or password" }, 401);
  }

  const token = await sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!
  );

  return c.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
});

export default auth;
