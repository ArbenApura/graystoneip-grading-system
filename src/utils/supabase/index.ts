// EXPORTED MODULES
export * from './database';
export * from './storage';
// IMPORTED LIB-TYPES
import type { Database } from './resources/database-types';
// IMPORTED LIB-UTILS
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_KEY,
	{ auth: { persistSession: false } },
);
