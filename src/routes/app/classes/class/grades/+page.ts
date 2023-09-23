// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type {
	Account,
	AdvanceCriteria,
	CourseClass,
	CourseStudentData,
	CriteriaGrade,
} from '$types/index';
// IMPORTED UTILS
import {
	selectAccount,
	selectCourseClass,
	selectCourseStudents,
	selectAdvanceCriterias,
	selectCriteriaGrades,
} from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const instructor_id = url.searchParams.get('instructor_id');
		const course_class_id = url.searchParams.get('course_class_id');
		if (!instructor_id || !course_class_id) throw new Error();
		let courseClass: CourseClass;
		let instructor: Account;
		let course_students: CourseStudentData[] = [];
		let advance_criterias: AdvanceCriteria[] = [];
		let criteria_grades: CriteriaGrade[] = [];
		await Promise.all([
			(courseClass = await selectCourseClass(course_class_id)),
			(instructor = await selectAccount(instructor_id)),
			(course_students = await selectCourseStudents({ course_class_id })),
			(advance_criterias = await selectAdvanceCriterias({
				course_class_id,
				term: 'MID TERM',
			})),
			(criteria_grades = await selectCriteriaGrades({ course_class_id })),
		]);
		if (!instructor) throw new Error();
		return { courseClass, instructor, course_students, advance_criterias, criteria_grades };
	} catch {
		throw redirect(300, '/app/classes?instructor_id=' + url.searchParams.get('instructor_id'));
	}
}) satisfies PageLoad;
