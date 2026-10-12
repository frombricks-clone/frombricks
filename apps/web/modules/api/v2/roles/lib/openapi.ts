import { ZodOpenApiOperationObject, ZodOpenApiPathsObject } from "zod-openapi";
import { ZRoles } from "@formbricks/database/zod/roles";
import { makePartialSchema } from "@/modules/api/v2/types/openapi-response";

export const getRolesEndpoint: ZodOpenApiOperationObject = {
  operationId: "getRoles",
  summary: "Get roles",
  description: "Gets roles from the database.",
  requestParams: {},
  tags: ["Roles"],
  responses: {
    "200": {
      description: "Roles retrieved successfully. This is a public read-only endpoint — no authentication required by design (see ENG-3316). The roles list is a static enum with no PII.",
      content: {
        "application/json": {
          schema: makePartialSchema(ZRoles),
        },
      },
    },
  },
};

export const rolePaths: ZodOpenApiPathsObject = {
  "/roles": {
    get: getRolesEndpoint,
  },
};
