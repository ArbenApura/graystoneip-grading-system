// IMPORTED TYPES
import type {
	AdvanceCriteria,
	AdvanceCriteriaItem,
	Criteria,
	CriteriaData,
	CriteriaGradeData,
	CriteriaItemData,
} from '$types/curriculum';
// IMPORTED UTILS
import { selectCriteriaGrades, selectCriteriaItems, supabase } from '..';

// UTILS
export const insertCriteria = async (criteria: Criteria) => {
	await isPercentageValid(criteria, criteria.percentage, true);
	const { error } = await supabase.from('criterias').insert(criteria);
	if (error) throw new Error(error.message);
};
export const selectCriteria = async (id: string) => {
	const { data, error } = await supabase
		.from('criterias')
		.select(
			`*, 
			course_class: course_classes(
				*, 
				instructor: accounts(*), 
				course: courses(*)
			)`,
		)
		.match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Class not found!');
	return data[0] as unknown as CriteriaData;
};
export const selectCriterias = async ({
	course_class_id,
	term,
}: {
	course_class_id: string;
	term: string;
}) => {
	let query = supabase
		.from('criterias')
		.select(
			`*, 
			course_class: course_classes(
				*, 
				instructor: accounts(*), 
				course: courses(*)
			)`,
		)
		.order('created_at');
	if (course_class_id) query.match({ course_class_id });
	if (term && term !== 'COMBINED') query.match({ term });
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data as unknown as CriteriaData[]) || [];
};
export const selectAdvanceCriterias = async ({
	course_class_id,
	term,
}: {
	course_class_id: string;
	term: string;
}) => {
	let advanced_criterias: AdvanceCriteria[] = [];
	let criterias: CriteriaData[];
	let criteria_items: CriteriaItemData[];
	let criteria_grades: CriteriaGradeData[];
	await Promise.all([
		(criterias = await selectCriterias({ course_class_id, term })),
		(criteria_items = await selectCriteriaItems({})),
		(criteria_grades = await selectCriteriaGrades({})),
	]);
	advanced_criterias = criterias.map((criteria) => {
		return {
			criteria,
			advance_criteria_items: criteria_items
				.filter((v) => v.criteria.id === criteria.id)
				.map((criteria_item) => {
					return {
						criteria_item,
						criteria_grades: criteria_grades
							.filter(
								(criteria_grade) =>
									criteria_grade.criteria_item_id === criteria_item.id,
							)
							.map((criteria_grade) => criteria_grade),
					};
				}),
		};
	});
	return advanced_criterias;
};
export const deleteCriteria = async (id: string) => {
	const { error } = await supabase.from('criterias').delete().match({ id });
	if (error) throw new Error(error.message);
};
export const updateCriteria = async (criteria: Criteria) => {
	const { error } = await supabase.from('criterias').update(criteria).match({ id: criteria.id });
	if (error) throw new Error(error.message);
};
export const updateCriteriaName = async (id: string, name: string) => {
	const { error } = await supabase.from('criterias').update({ name }).match({ id });
	if (error) throw new Error(error.message);
};
export const updateCriteriaPercentage = async (criteria: Criteria, percentage: number) => {
	await isPercentageValid(criteria, percentage, true);
	const { error } = await supabase
		.from('criterias')
		.update({ percentage })
		.match({ id: criteria.id });
	if (error) throw new Error(error.message);
};
export const isPercentageValid = async (
	{ course_class_id, term, id }: Criteria,
	percentage: number,
	throw_error = false,
) => {
	if (percentage < 1 || percentage > 100) throw new Error('Percentage is invalid!');
	const { data, error } = await supabase
		.from('criterias')
		.select('percentage')
		.match({ course_class_id, term })
		.neq('id', id);
	if (error) throw new Error(error.message);
	if (!data || !data.length) return true;
	let sum = 0;
	data.map(({ percentage }) => (sum += percentage || 0));
	if (throw_error) if (sum + percentage > 100) throw new Error('Percentage is invalid!');
	return sum + percentage <= 100;
};
