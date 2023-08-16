// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectEnrollees, selectCourses, selectPrograms } from '$utils/supabase';

export const load = (async () => {
	const enrollees = await selectEnrollees({});
	const programs = await selectPrograms({});
	const courses = await selectCourses({});
	return { enrollees, programs, courses };
}) satisfies PageLoad;
