// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectEnrollees, selectPrograms } from '$utils/supabase';

export const load = (async () => {
	const enrollees = await selectEnrollees({ is_archived: true });
	const programs = await selectPrograms({ is_archived: true });
	return { enrollees, programs };
}) satisfies PageLoad;
