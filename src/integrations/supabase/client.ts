
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xnucqitnwnlndciwryue.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhudWNxaXRud25sbmRjaXdyeXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTgxMzksImV4cCI6MjA1ODIzNDEzOX0.3AdrpSFw4KGmU3NxXhKrr9M9pI2iBDEMuFE2YDasq3M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetch
  }
});

// Export the SUPABASE_URL separately to avoid using the protected property
export { SUPABASE_URL };
