import { config } from '@dotenvx/dotenvx';
import { z } from 'zod';

config()


const dbEnvSchema = z.object({
    POSTGRES_HOST: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PORT: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && val > 0, {
        message: "DB PORT must be a positive number",
    }),
});


const dbEnv = dbEnvSchema.safeParse(process.env);

if (!dbEnv.success) {
    console.error("Invalid environment variables:", dbEnv.error.format());
    process.exit(1);
}

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    TG_BOT_TOKEN: z.string().min(1).includes(':'),
});


const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error("Invalid environment variables:", env.error.format());
    process.exit(1);
}

export const SETTINGS = env.data