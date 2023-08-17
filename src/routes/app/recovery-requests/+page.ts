// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectRecoveryRequests } from '$utils/supabase';

export const load = (async () => {
	const recoveryRequests = await selectRecoveryRequests({});
	return { recoveryRequests };
}) satisfies PageLoad;
