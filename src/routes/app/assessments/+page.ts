// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED TYPES
import type { Account, CriteriaGradeData, CriteriaItemData } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectAssessmentsByStudentId, selectCriteriaGrades } from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const student_id = url.searchParams.get('student_id');
		if (!student_id) throw new Error();
		let student: Account;
		let assessments: CriteriaItemData[];
		let criteria_grades: CriteriaGradeData[] = [];
		await Promise.all([
			(student = await selectAccount(student_id)),
			(assessments = await selectAssessmentsByStudentId(student_id)),
		]);
		await Promise.all(
			assessments.map(async (assessment) => {
				let _criteria_grades = await selectCriteriaGrades({
					course_class_id: assessment.criteria.course_class_id,
				});
				criteria_grades = [...criteria_grades, ..._criteria_grades];
			}),
		);
		return { student, assessments, criteria_grades };
	} catch {
		throw redirect(300, '/app/grades?student_id=' + url.searchParams.get('student_id'));
	}
}) satisfies PageLoad;
