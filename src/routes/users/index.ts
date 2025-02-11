import { Hono } from "hono";

import { db } from "@/db/index.ts";

import { users } from "@/db/schema/users.ts";

import { getUsers } from "./routes.ts";

const userRouter = new Hono();

userRouter.get("/", async (c) => {
  const userList = await db.select().from(users).limit(2);

  return c.json(userList);
});

userRouter.post("/", async (c) => {
  const { firstName, lastName, username, email, password, role } =
    await c.req.json();

  const newUser = await db
    .insert(users)
    .values({ firstName, lastName, username, email, password, role });

  return c.json(newUser);
});

export default userRouter;
