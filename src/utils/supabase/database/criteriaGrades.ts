// IMPORTED TYPES
import type { CriteriaGrade, CriteriaGradeData } from '$types/curriculum';
// IMPORTED UTILS
import { supabase } from '..';

// UTILS
export const insertCriteriaGrade = async (criteriaGrade: CriteriaGrade) => {
	const { error } = await supabase.from('criteria_grades').insert(criteriaGrade);
	if (error) throw new Error(error.message);
};
export const selectCriteriaGrade = async (id: string) => {
	const { data, error } = await supabase
		.from('criteria_grades')
		.select(
			`
			*, 
			criteria_item: criteria_items(
				*, 
				criteria: criterias(
					*, 
					course_class: course_classes(
						*, 
						instructor: accounts(*), 
						course: courses(*)
					)
				)
			), 
			course_student: course_students(
				*, 
				course_class: course_classes(
					*, 
					instructor: accounts(*), 
					course: courses(*)
				), 
				student_record: student_records(
					*, 
					account: accounts(*), 
					program: programs(*)
				)
			)`,
		)
		.match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Class not found!');
	return data[0] as unknown as CriteriaGradeData;
};
export const selectCriteriaGrades = async ({ course_class_id }: { course_class_id?: string }) => {
	let query = supabase.from('criteria_grades').select(
		`
			*, 
			criteria_item: criteria_items(
				*, 
				criteria: criterias(
					*, 
					course_class: course_classes(
						*, 
						instructor: accounts(*), 
						course: courses(*)
					)
				)
			), 
			course_student: course_students(
				*, 
				course_class: course_classes(
					*, 
					instructor: accounts(*), 
					course: courses(*)
				), 
				student_record: student_records(
					*, 
					account: accounts(*), 
					program: programs(*)
				)
			)`,
	);
	if (course_class_id) query.match({ course_class_id });
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data as unknown as CriteriaGradeData[]) || [];
};
export const deleteCriteriaGrade = async (id: string) => {
	const { error } = await supabase.from('criteria_items').delete().match({ id });
	if (error) throw new Error(error.message);
};
export const updateCriteriaGrade = async (criteriaGrade: CriteriaGrade) => {
	const { error } = await supabase
		.from('criteria_grades')
		.update(criteriaGrade)
		.match({ id: criteriaGrade.id });
	if (error) throw new Error(error.message);
};
export const observeCriteriaGradeScore = async (criteria_item_id: string, total: number) => {
	const { error } = await supabase
		.from('criteria_grades')
		.update({ score: total })
		.gt('score', total)
		.match({ criteria_item_id });
	if (error) throw new Error(error.message);
};
