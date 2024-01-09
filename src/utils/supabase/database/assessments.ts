// IMPORTED TYPES
import type { AssessmentQuestion, CriteriaItemData } from '$types';
// IMPORTED UTILS
import { selectCourseStudents, selectCriteriaItems, supabase } from '..';

// UTILS
export const selectAssessment = async (id: string) => {
	const { data, error } = await supabase
		.from('criteria_items')
		.select(
			`*, 
            criteria: criterias(
                *, 
                course_class: course_classes(
                    *, 
                    instructor: accounts(*), 
                    course: courses(*)
                )
            )`,
		)
		.match({ id });
	if (error) throw error;
	if (!data || !data.length) throw new Error('Assessment was not found!');
	const assessment = data[0];
	if (assessment.questions) assessment.questions = JSON.parse(assessment.questions as string);
	return assessment as unknown as CriteriaItemData;
};
export const selectAssessments = async (course_class_id: string) => {
	let criteriaItems = await selectCriteriaItems({});
	criteriaItems = criteriaItems.filter(
		(item) => item.criteria.course_class_id === course_class_id && item.is_assessment,
	);
	return criteriaItems;
};
export const selectAssessmentsByStudentId = async (student_id: string) => {
	const course_students = await selectCourseStudents({ student_id });
	let assessments: CriteriaItemData[] = [];
	await Promise.all(
		course_students.map(async ({ course_class_id }) => {
			const _assessments = await selectAssessments(course_class_id);
			assessments = [...assessments, ..._assessments];
		}),
	);
	return assessments;
};
export const openAssessment = async (id: string) => {
	const { error } = await supabase.from('criteria_items').update({ is_open: true }).match({ id });
	if (error) throw error;
};
export const closeAssessment = async (id: string) => {
	const { error } = await supabase
		.from('criteria_items')
		.update({ is_open: false })
		.match({ id });
	if (error) throw error;
};
export const updateAssessment = async (
	id: string,
	data: {
		total?: number;
		title?: string;
		description?: string;
		is_open?: boolean;
		questions?: AssessmentQuestion[] | string;
	},
) => {
	if (data.questions) data.questions = JSON.stringify(data.questions);
	const { error } = await supabase.from('criteria_items').update(data).match({ id });
	if (error) throw error;
};
