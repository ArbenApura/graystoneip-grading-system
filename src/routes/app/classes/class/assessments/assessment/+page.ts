// IMPORTED LIB-TYPES
import type { PageLoad } from '../$types';
// IMPORTED TYPES
import type { Account, CourseClass, CriteriaItemData } from '$types/index';
// IMPORTED UTILS
import { selectAccount, selectCourseClass, selectAssessment } from '$utils/supabase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	try {
		const instructor_id = url.searchParams.get('instructor_id');
		const course_class_id = url.searchParams.get('course_class_id');
		const assessment_id = url.searchParams.get('assessment_id');
		if (!instructor_id || !course_class_id || !assessment_id) throw new Error();
		let courseClass: CourseClass;
		let instructor: Account;
		let assessment: CriteriaItemData;
		await Promise.all([
			(courseClass = await selectCourseClass(course_class_id)),
			(instructor = await selectAccount(instructor_id)),
			(assessment = await selectAssessment(assessment_id)),
		]);
		if (!instructor) throw new Error();
		return { courseClass, instructor, assessment };
	} catch {
		throw redirect(300, '/app/classes?instructor_id=' + url.searchParams.get('instructor_id'));
	}
}) satisfies PageLoad;
