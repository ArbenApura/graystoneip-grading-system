// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectEnrollees, selectPrograms } from '$utils/supabase';

export const load = (async () => {
	const enrollees = await selectEnrollees({});
	const programs = await selectPrograms({});
	return { enrollees, programs };
}) satisfies PageLoad;
