import OpenAI from 'openai';
import { createClient } from "@supabase/supabase-js";

/** OpenAI config */
const openAIKey = typeof process !== 'undefined' && process.env ? process.env.VITE_OPENAI_API_KEY : import.meta.env.VITE_OPENAI_API_KEY;
if (!openAIKey) throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: openAIKey,
  dangerouslyAllowBrowser: true
});

/** Supabase config */
export const supabaseUrl = typeof process !== 'undefined' && process.env ? process.env.VITE_SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) throw new Error(`Expected env var VITE_SUPABASE_URL`);
export const supabaseKey = typeof process !== 'undefined' && process.env ? process.env.VITE_SUPABASE_API_KEY : import.meta.env.VITE_SUPABASE_API_KEY;
if (!supabaseKey) throw new Error(`Expected env var VITE_SUPABASE_API_KEY`);
export const supabase = createClient(supabaseUrl, supabaseKey);