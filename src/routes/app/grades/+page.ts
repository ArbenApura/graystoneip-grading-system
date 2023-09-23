// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { CourseStudentData, Account } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectCourseStudents } from '$utils/supabase';

export const load = (async ({ url }) => {
	const student_id = url.searchParams.get('student_id');
	if (!student_id) throw new Error();
	let courseStudents: CourseStudentData[] = [];
	let student: Account;
	await Promise.all([
		(courseStudents = await selectCourseStudents({ student_id })),
		(student = await selectAccount(student_id)),
	]);
	if (!student) throw new Error();
	return { courseStudents, student };
}) satisfies PageLoad;
