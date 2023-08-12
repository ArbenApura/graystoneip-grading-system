// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectAccounts } from '$utils/supabase';

export const load = (async () => {
	const admins = await selectAccounts({ type: 'admin', search: '' });
	return { admins };
}) satisfies PageLoad;
