// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectAccounts } from '$utils/supabase';

export const load = (async () => {
	const instructors = await selectAccounts({ type: 'instructor', is_archived: true });
	return { instructors };
}) satisfies PageLoad;
