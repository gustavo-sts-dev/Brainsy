import { buildApp } from "./app.ts";

async function startServer() {
  const app = await buildApp();
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    app.log.info("Servidor iniciado com sucesso!");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();
