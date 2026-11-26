import fastify from "fastify";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { env } from "#config/env.config";

function buildApp(opts = {}) {
  const app = fastify(opts);

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

  return app;
}

export { buildApp };
