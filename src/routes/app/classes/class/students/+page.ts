// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { Account, CourseClass, CourseStudentData } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectCourseClass, selectCourseStudents } from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const professor_id = url.searchParams.get('professor_id');
		const course_class_id = url.searchParams.get('course_class_id');
		if (!professor_id || !course_class_id) throw new Error();
		let professor: Account;
		let courseClass: CourseClass;
		let students: CourseStudentData[];
		await Promise.all([
			(professor = await selectAccount(professor_id)),
			(courseClass = await selectCourseClass(course_class_id)),
			(students = await selectCourseStudents({ course_class_id })),
		]);
		if (!professor) throw new Error();
		return { professor, courseClass, students };
	} catch {
		throw redirect(300, '/app/dashboard');
	}
}) satisfies PageLoad;
