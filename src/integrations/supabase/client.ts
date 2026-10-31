import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://bvgipeufcfecrgmxxmoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2lwZXVmY2ZlY3JnbXh4bW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjk4NjUsImV4cCI6MjEwODg0NTg2NX0.sTFCskqr7bJgaC_m1Ev8Bb1SAV-K1wHoQBiyiozZvIc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
