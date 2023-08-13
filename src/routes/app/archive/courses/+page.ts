// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectCourses } from '$utils/supabase';

export const load = (async () => {
	const courses = await selectCourses({ is_archived: true });
	return { courses };
}) satisfies PageLoad;
