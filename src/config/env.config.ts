import z from "zod";
import path from "node:path";

if (process.env.NODE_ENV !== "production")
  process.loadEnvFile(path.join(import.meta.dirname, "../../.env.local"));

const env = z
  .object({
    NODE_ENV: z.enum(["test", "development", "production"]),
    PORT: z.coerce.number().min(1).max(10000),
    ORIGINS: z.string().transform((data) => {
      const origins = data.split(",");
      const invalid = origins.find((origin) => !origin.startsWith("http://"));
      if (invalid) throw new Error(`Origem http não permitida: ${invalid}.`);
      return origins;
    }),
    COOKIE_SECRET: z.string().min(32),
  })
  .parse(process.env);

export { env };
