import { createClient } from "@supabase/supabase-js";
import { config } from "./env.config.js";

// Load from environment
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY as string;
// const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(config.supabase.url, config.supabase.secretKey);
