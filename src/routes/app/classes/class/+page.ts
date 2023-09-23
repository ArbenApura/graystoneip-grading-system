// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { Account, CourseClass, CourseStudentData } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectCourseClass, selectCourseStudents } from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const instructor_id = url.searchParams.get('instructor_id');
		const course_class_id = url.searchParams.get('course_class_id');
		if (!instructor_id || !course_class_id) throw new Error();
		let courseClass: CourseClass;
		let instructor: Account;
		let courseStudents: CourseStudentData[] = [];
		await Promise.all([
			(courseClass = await selectCourseClass(course_class_id)),
			(instructor = await selectAccount(instructor_id)),
			(courseStudents = await selectCourseStudents({ course_class_id })),
		]);
		if (!instructor) throw new Error();
		return { courseClass, instructor, courseStudents };
	} catch {
		throw redirect(300, '/app/classes?instructor_id=' + url.searchParams.get('instructor_id'));
	}
}) satisfies PageLoad;
