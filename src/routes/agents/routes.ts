import { z, createRoute } from "@hono/zod-openapi";

import {
  agentSelectSchema,
  agentInsertSchema,
  agentUpdateSchema,
} from "@/db/schema/agents.ts";

export const getAllAgents = createRoute({
  method: "get",
  path: "/",
  tags: ["agents"],
  summary: "Get all agents",
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: "Retrieved agent successfully",
      content: {
        "application/json": {
          schema: agentSelectSchema.openapi("AgentResponse"),
        },
      },
    },
    400: {
      description: "Agent not found",
    },
  },
});

export const getAgentById = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["agents"],
  summary: "Get agent by id",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Return agent by id",
      content: {
        "application/json": {
          schema: agentSelectSchema.openapi("AgentResponse"),
        },
      },
    },
    400: {
      description: "Agent not found",
    },
  },
});

export const createAgent = createRoute({
  method: "post",
  path: "/",
  tags: ["agents"],
  summary: "Create agent",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: agentInsertSchema.openapi("AgentInsert"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Agent created successfully",
    },
    400: {
      description: "Agent not created",
    },
  },
});

export const updateAgent = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["agents"],
  summary: "Update agent",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: agentUpdateSchema.openapi("AgentUpdate"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Agent updated successfully",
    },
    400: {
      description: "Agent not updated",
    },
  },
});

export const deleteAgent = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["agents"],
  summary: "Delete agent",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Agent deleted successfully",
    },
    400: {
      description: "Agent not deleted",
    },
  },
});
