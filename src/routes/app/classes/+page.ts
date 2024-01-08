// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { CourseClassData, Course, Account } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectCourseClasses, selectCourses } from '$utils/supabase';

export const load = (async ({ url }) => {
	const instructor_id = url.searchParams.get('instructor_id');
	if (!instructor_id) throw new Error();
	let courseClasses: CourseClassData[] = [];
	let courses: Course[] = [];
	let instructor: Account;
	await Promise.all([
		(courseClasses = await selectCourseClasses({ instructor_id: instructor_id })),
		(courses = await selectCourses({})),
		(instructor = await selectAccount(instructor_id)),
	]);
	if (!instructor) throw new Error();
	return { courseClasses, courses, instructor };
}) satisfies PageLoad;
