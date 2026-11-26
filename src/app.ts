import fastify from "fastify";

function buildApp(opts = {}) {
  const app = fastify(opts);

  return app;
}

export { buildApp };
