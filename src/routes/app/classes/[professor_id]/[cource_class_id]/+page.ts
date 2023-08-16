// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectCourseClass } from '$utils/supabase';

export const load = (async ({ params }) => {
	const courseClass = await selectCourseClass(params.cource_class_id);
	return { courseClass };
}) satisfies PageLoad;
