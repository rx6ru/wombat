import { createClient } from "@supabase/supabase-js";
import { config } from "./env.config.js";

// Create the Supabase admin client using the centralized and validated config.
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.secretKey
);
