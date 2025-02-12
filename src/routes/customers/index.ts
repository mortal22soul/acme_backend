import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";
import { customers } from "@/db/schema/customers.ts";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/routes/customers/routes.ts";

const customerRouter = new OpenAPIHono();

customerRouter.openapi(getAllCustomers, async (c) => {
  const customerList = await db.select().from(customers);
  return c.json(customerList);
});

customerRouter.openapi(getCustomerById, async (c) => {
  const id = c.req.param("id");

  const customer = await db
    .select()
    .from(customers)
    .where(eq(customers.id, Number(id)));
  return c.json(customer);
});

customerRouter.openapi(createCustomer, async (c) => {
  const customer = await c.req.json();
  await db.insert(customers).values(customer);
  return c.text("Customer created successfully");
});

customerRouter.openapi(updateCustomer, async (c) => {
  const id = c.req.param("id");
  const customer = await c.req.json();

  await db
    .update(customers)
    .set(customer)
    .where(eq(customers.id, Number(id)));

  return c.text("Customer updated successfully");
});

customerRouter.openapi(deleteCustomer, async (c) => {
  const id = c.req.param("id");

  await db.delete(customers).where(eq(customers.id, Number(id)));
  return c.text("Customer deleted successfully");
});

export default customerRouter;
