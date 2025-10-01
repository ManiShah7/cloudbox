import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import routes from "./routes";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.route("/api", routes);

app.get("/", (c) => {
  return c.text("Yo! CloudBox API is running!");
});

const port = 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
