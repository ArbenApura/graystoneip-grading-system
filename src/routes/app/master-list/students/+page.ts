// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectAccounts } from '$utils/supabase';

export const load = (async () => {
	const students = await selectAccounts({ type: 'student', search: '' });
	return { students };
}) satisfies PageLoad;
