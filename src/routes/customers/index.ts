import { Hono } from "hono";
import { db } from "@/db/index.ts";
import { customers } from "@/db/schema/customers.ts";

const customerRouter = new Hono();

customerRouter.get("/", async (c) => {
  const customerList = await db.select().from(customers).limit(2);
  return c.json(customerList);
});

export default customerRouter;
