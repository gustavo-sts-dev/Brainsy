import { buildApp } from "./app.ts";
import { env } from "#config/env.config.ts";

async function startServer() {
  const app = await buildApp({
    logger: true,
    bodyLimit: 2097152, // 2MiB
  });
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info("Servidor iniciado com sucesso!");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();
