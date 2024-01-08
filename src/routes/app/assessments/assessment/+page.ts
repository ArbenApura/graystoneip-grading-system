// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { Account, CourseStudentData, CriteriaGradeData, CriteriaItemData } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectAssessment, selectCriteriaGrades } from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const student_id = url.searchParams.get('student_id');
		const assessment_id = url.searchParams.get('assessment_id');
		if (!student_id || !assessment_id) throw new Error();
		let student: Account;
		let assessment: CriteriaItemData;
		let criteria_grades: CriteriaGradeData[];
		let course_student: CourseStudentData | undefined;
		await Promise.all([
			(student = await selectAccount(student_id)),
			(assessment = await selectAssessment(assessment_id)),
		]);
		criteria_grades = await selectCriteriaGrades({
			course_class_id: assessment.criteria.course_class_id,
		});
		criteria_grades.forEach((criteria_grade) => {
			if (criteria_grade.course_student.student_record.account_id === student_id) {
				course_student = criteria_grade.course_student;
			}
		});
		if (!assessment.is_open || !course_student) throw new Error();
		criteria_grades.forEach((criteria_grade) => {
			if (
				criteria_grade.criteria_item_id === assessment.id &&
				criteria_grade.course_student.student_record.account_id === student.id
			) {
				throw new Error();
			}
		});
		return { student, assessment, course_student };
	} catch {
		throw redirect(300, '/app/assessments?student_id=' + url.searchParams.get('student_id'));
	}
}) satisfies PageLoad;
