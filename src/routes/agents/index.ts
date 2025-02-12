import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";
import { agents } from "@/db/schema/agents.ts";
import {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from "./routes.ts";

const agentRouter = new OpenAPIHono();

agentRouter.openapi(getAllAgents, async (c) => {
  const agentList = await db.select().from(agents).limit(2);

  return c.json(agentList);
});

agentRouter.openapi(getAgentById, async (c) => {
  const id = c.req.param("id");

  const agent = await db.select().from(agents).where(eq(agents.id, id));
  return c.json(agent);
});

agentRouter.openapi(createAgent, async (c) => {
  const agent = await c.req.json();
  await db.insert(agents).values(agent);
  return c.text("Agent created successfully");
});

agentRouter.openapi(updateAgent, async (c) => {
  const id = c.req.param("id");
  const agent = await c.req.json();

  await db.update(agents).set(agent).where(eq(agents.id, id));

  return c.text("Agent updated successfully");
});

agentRouter.openapi(deleteAgent, async (c) => {
  const id = c.req.param("id");

  await db.delete(agents).where(eq(agents.id, id));
  return c.text("Agent deleted successfully");
});

export default agentRouter;
