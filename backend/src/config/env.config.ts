import dotenv from "dotenv";

dotenv.config(); 

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`!!! Missing required env variable: ${key}`);
  }
  console.log(`[] ENV Loaded: ${key}`);
  return value;
}

export const config = {
  port: Number(getEnv("PORT", "3000")),
  nodeEnv: getEnv("NODE_ENV", "development"),

  supabase: {
    dbUrl: getEnv("SUPABASE_DATABASE_URL"),
    directUrl: getEnv("SUPABASE_DIRECT_URL"),
    url: getEnv("SUPABASE_URL"),
    secretKey: getEnv("SUPABASE_SECRET_KEY"),
    publishableKey: getEnv("SUPABASE_PUBLISHABLE_KEY"),
    jwksUrl: getEnv("SUPABASE_JWKS_URL"),
  },

  redis: {
    restUrl: getEnv("UPSTASH_REDIS_REST_URL"),
    restToken: getEnv("UPSTASH_REDIS_REST_TOKEN"),
  },

  security: {
    kmsProvider: getEnv("KMS_PROVIDER", "aws"), // default to AWS, for future use
  },
};

export function validateEnv() {
  const required = [
    "SUPABASE_DATABASE_URL",
    "SUPABASE_DIRECT_URL",
    "SUPABASE_URL",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_JWKS_URL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`!!! Missing recommended env variable: ${key}`);
    }
  }
}
