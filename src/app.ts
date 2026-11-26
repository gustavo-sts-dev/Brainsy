import fastify from "fastify";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  type ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from "@fastify/type-provider-zod";
import z from "zod";
import { env } from "#config/env.config";

function buildApp(opts = {}) {
  const app = fastify(opts).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const origins = env.ORIGINS.filter(Boolean);

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },
    referrerPolicy: {
      policy: "same-origin",
    },
    hsts: {
      maxAge: 31536000,
    },
    frameguard: {
      action: "sameorigin",
    },
  });
  app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });
  app.register(cors, {
    origin(origin, callback) {
      if (!origin || origins?.includes(origin!)) callback(null, true);
      else callback(new Error("Origem não aceita."), false);
    },
  });

  async function registerSwagger() {
    await app.register(swagger, {
      openapi: {
        info: {
          title: "Brainsy API",
          description: "Documentação automática gerada pelo Fastify",
          version: "1.0.0",
        },
      },
    });

    await app.register(swaggerUi, {
      routePrefix: "/docs",
    });
  }

  if (env.NODE_ENV === "development") registerSwagger();

  app.get(
    "/health",
    {
      schema: {
        response: {
          200: z.object({
            status: z.string(),
          }),
        },
      },
    },
    async () => ({ status: "ok" }),
  );

  return app;
}

export { buildApp };
