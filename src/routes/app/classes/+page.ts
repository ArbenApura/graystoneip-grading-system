// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { CourseClassData, Course, Account } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectCourseClasses, selectCourses } from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const professor_id = url.searchParams.get('professor_id');
		if (!professor_id) throw new Error();
		let courseClasses: CourseClassData[] = [];
		let courses: Course[] = [];
		let professor: Account;
		await Promise.all([
			(courseClasses = await selectCourseClasses({
				semester: '1st',
				school_year: '2023-2024',
				professor_id: professor_id,
			})),
			(courses = await selectCourses({})),
			(professor = await selectAccount(professor_id)),
		]);
		if (!professor) throw new Error();
		return { courseClasses, courses, professor };
	} catch {
		throw redirect(300, '/app/dashboard');
	}
}) satisfies PageLoad;
