import { Hono } from "hono";
import { db } from "@/db/index.ts";
import { agents } from "@/db/schema/agents.ts";

const agentRouter = new Hono();

agentRouter.get("/", async (c) => {
  const agentList = await db.select().from(agents).limit(2);
  return c.json(agentList);
});

export default agentRouter;
