import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getAllPayments,
  getPaymentById,
  deletePayment,
  updatePayment,
  createPayment,
} from "./routes.ts";
import { payments } from "@/db/schema/payments.ts";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";

const paymentRouter = new OpenAPIHono();

paymentRouter.openapi(getAllPayments, async (c) => {
  const paymentsList = await db.select().from(payments);
  return c.json(paymentsList);
});

paymentRouter.openapi(getPaymentById, async (c) => {
  const id = await c.req.param("id");
  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.id, Number(id)));
  return c.json(payment);
});

paymentRouter.openapi(createPayment, async (c) => {
  const payment = await c.req.json();
  await db.insert(payments).values(payment);
  return c.json({ message: "Payment created" });
});

paymentRouter.openapi(deletePayment, async (c) => {
  const id = await c.req.param("id");
  await db.delete(payments).where(eq(payments.id, Number(id)));
  return c.json({ message: "Payment deleted" });
});

paymentRouter.openapi(updatePayment, async (c) => {
  const id = await c.req.param("id");
  const payment = await c.req.json();
  await db
    .update(payments)
    .set(payment)
    .where(eq(payments.id, Number(id)));
  return c.json({ message: "Payment updated" });
});

export default paymentRouter;
