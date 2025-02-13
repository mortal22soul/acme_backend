import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import authRouter, { verifyToken } from "@/routes/auth/index.ts";
import userRouter from "@/routes/users/index.ts";
import customerRouter from "@/routes/customers/index.ts";
import agentRouter from "@/routes/agents/index.ts";
import tripRouter from "@/routes/trips/index.ts";
import bookingRouter from "@/routes/bookings/index.ts";
import paymentRouter from "@/routes/payments/index.ts";
import reviewRouter from "@/routes/reviews/index.ts";
import itineraryRouter from "@/routes/itineraries/index.ts";

const app = new OpenAPIHono();

app.get("/", (c) => c.text("Hello Hono!"));

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

app.doc("/openapi", {
  openapi: "3.1.1",
  info: {
    version: "0.0.1",
    title: "Backend for Travel Agency",
  },
});
app.get("/docs", swaggerUI({ url: "/openapi" }));

app.route("/auth", authRouter);

// Middleware to verify token
app.use("*", verifyToken);

// Protected Routes (Require Authentication)
app.route("/users", userRouter);
app.route("/customers", customerRouter);
app.route("/agents", agentRouter);
app.route("/bookings", bookingRouter);
app.route("/trips", tripRouter);
app.route("/payments", paymentRouter);
app.route("/reviews", reviewRouter);
app.route("/itineraries", itineraryRouter);

app.onError((err, c) => {
  console.error("Global Error:", err);
  return c.json({ message: "Internal Server Error" }, 500);
});

const startServer = async () => {
  const port = 3000;
  console.log(`Server is running on http://localhost:${port}`);

  await serve({
    fetch: app.fetch,
    port,
  });
};

startServer();
