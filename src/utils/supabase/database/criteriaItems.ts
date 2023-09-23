// IMPORTED TYPES
import type { CriteriaItem, CriteriaItemData } from '$types/curriculum';
// IMPORTED UTILS
import { observeCriteriaGradeScore, supabase } from '..';

// UTILS
export const insertCriteriaItem = async (criteriaItem: CriteriaItem) => {
	const { error } = await supabase.from('criteria_items').insert(criteriaItem);
	if (error) throw new Error(error.message);
};
export const selectCriteriaItem = async (id: string) => {
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
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Class not found!');
	return data[0] as unknown as CriteriaItemData;
};
export const selectCriteriaItems = async ({ criteria_id }: { criteria_id?: string }) => {
	let query = supabase
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
		.order('created_at', { ascending: false });
	if (criteria_id) query.match({ criteria_id });
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data as unknown as CriteriaItemData[]) || [];
};
export const deleteCriteriaItem = async (id: string) => {
	const { error } = await supabase.from('criteria_items').delete().match({ id });
	if (error) throw new Error(error.message);
};
export const updateCriteriaItem = async (criteriaItem: CriteriaItem) => {
	const { error } = await supabase
		.from('criteria_items')
		.update(criteriaItem)
		.match({ id: criteriaItem.id });
	if (error) throw new Error(error.message);
	await observeCriteriaGradeScore(criteriaItem.id, criteriaItem.total);
};
