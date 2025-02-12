import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import userRouter from "@/routes/users/index.ts";
import customerRouter from "@/routes/customers/index.ts";
import agentRouter from "@/routes/agents/index.ts";

const app = new OpenAPIHono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "Backend for travel agency",
  },
});

app.get("/docs", swaggerUI({ url: "/openapi" }));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

app.route("/users", userRouter);
// app.route("/customers", customerRouter);
// app.route("/agents", agentRouter);
