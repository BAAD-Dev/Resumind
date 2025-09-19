import dotenv from "dotenv";
dotenv.config();

const required = ["DATABASE_URL", "JWT_SECRET", "PORT"] as const;
for (const k of required) {
    if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

export const env = {
    port: Number(process.env.PORT || 3000),
    jwtSecret: process.env.JWT_SECRET!,
};
