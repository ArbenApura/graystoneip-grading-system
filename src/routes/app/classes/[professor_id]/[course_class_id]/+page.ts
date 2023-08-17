// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectAccount, selectCourseClass } from '$utils/supabase';

export const load = (async ({ params }) => {
	const courseClass = await selectCourseClass(params.course_class_id);
	const professor = await selectAccount(params.professor_id);
	return { courseClass, professor };
}) satisfies PageLoad;
