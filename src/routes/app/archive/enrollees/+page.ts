// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectEnrollees, selectCourses, selectPrograms } from '$utils/supabase';

export const load = (async () => {
	const enrollees = await selectEnrollees({ is_archived: true });
	const programs = await selectPrograms({ is_archived: true });
	const courses = await selectCourses({ is_archived: true });
	return { enrollees, programs, courses };
}) satisfies PageLoad;
