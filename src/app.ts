import fastify from "fastify";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

function buildApp(opts = {}) {
  const app = fastify(opts);

  const origins = process.env.ORIGINS?.split(",").filter(Boolean);

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
    secret: process.env.COOKIE_SECRET,
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
