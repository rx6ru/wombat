import dotenv from "dotenv";

dotenv.config(); 

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

export const config = {
  port: Number(getEnv("PORT", "3000")),
  nodeEnv: getEnv("NODE_ENV", "development"),

  supabase: {
    url: getEnv("SUPABASE_URL"),
    secretKey: getEnv("SUPABASE_SECRET_KEY"),
    publishableKey: getEnv("SUPABASE_PUBLISHABLE_KEY"),
    jwks_url: getEnv("SUPABASE_JWKS_URL"),
  },
};
