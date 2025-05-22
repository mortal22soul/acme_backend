import { db } from "@/db/index.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users.ts";
import {
  getUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@/routes/users/routes.ts";

const userRouter = new OpenAPIHono();

userRouter.openapi(getAllUsers, async (c) => {
  const userList = await db.select().from(users).limit(2);

  return c.json(userList);
});

userRouter.openapi(getUserById, async (c) => {
  const id = c.req.param("id");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));
  return c.json(user);
});

userRouter.openapi(updateUser, async (c) => {
  const id = c.req.param("id");
  const user = await c.req.json();

  await db
    .update(users)
    .set(user)
    .where(eq(users.id, Number(id)));

  return c.text("User updated successfully");
});

userRouter.openapi(deleteUser, async (c) => {
  const id = c.req.param("id");

  await db.delete(users).where(eq(users.id, Number(id)));
  return c.text("User deleted successfully");
});

export default userRouter;
