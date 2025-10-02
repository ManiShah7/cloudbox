import auth from "./auth";
import { createRouter } from "../lib/hono";
import files from "./files";

const routes = createRouter();

routes.route("/auth", auth);
routes.route("/files", files);

export default routes;
