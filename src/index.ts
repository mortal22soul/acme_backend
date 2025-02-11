import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRouter from "@/routes/users/index.ts";
import customerRouter from "@/routes/customers/index.ts";
import agentRouter from "@/routes/agents/index.ts";

const app = new Hono();
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

app.route("/users", userRouter);
app.route("/customers", customerRouter);
app.route("/agents", agentRouter);
