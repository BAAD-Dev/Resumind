import dotenv from "dotenv";
dotenv.config();

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "PORT",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GEMINI_API_KEY"
];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

export const env = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET!,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
  geminiApiKey: process.env.GEMINI_API_KEY!
};
