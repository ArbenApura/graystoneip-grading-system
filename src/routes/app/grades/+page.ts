// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { CourseStudentData, Account } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectCourseStudents } from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const student_id = url.searchParams.get('student_id');
		const semester = url.searchParams.get('semester') || '1st';
		const school_year = url.searchParams.get('school_year') || '2023-2024';
		if (!student_id) throw new Error();
		let courseStudents: CourseStudentData[] = [];
		let student: Account;
		await Promise.all([
			(courseStudents = await selectCourseStudents({
				student_id,
				semester,
				school_year,
			})),
			(student = await selectAccount(student_id)),
		]);
		if (!student) throw new Error();
		return { courseStudents, student };
	} catch {
		throw redirect(300, '/app/dashboard');
	}
}) satisfies PageLoad;
