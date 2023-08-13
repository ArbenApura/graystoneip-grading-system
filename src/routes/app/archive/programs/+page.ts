// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectPrograms } from '$utils/supabase';

export const load = (async () => {
	const programs = await selectPrograms({ is_archived: true });
	return { programs };
}) satisfies PageLoad;
