// IMPORTED TYPES
import type { Course } from '$types/curriculum';
// IMPORTED UTILS
import { MONTH, WEEK, YEAR } from '$utils/constants';
import { supabase } from '..';

// UTILS
export const insertCourse = async (course: Course) => {
	if (await isCourseCodeTaken(course.code)) throw new Error('Code is already taken!');
	const { error } = await supabase.from('courses').insert(course);
	if (error) throw new Error(error.message);
};
export const selectCourses = async ({
	search,
	is_archived,
}: {
	search?: string;
	is_archived?: boolean;
}) => {
	let query = supabase
		.from('courses')
		.select()
		.eq('is_archived', typeof is_archived === 'undefined' ? false : is_archived);
	if (search) query.ilike('code', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data as Course[]) || [];
};
export const archiveCourse = async (id: string) => {
	const { error } = await supabase.from('courses').update({ is_archived: true }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const unarchiveCourse = async (id: string) => {
	const { error } = await supabase.from('courses').update({ is_archived: false }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const updateCourse = async (course: Course) => {
	if (await isCourseCodeOverwrite(course.id, course.code))
		throw new Error('Code is already taken!');
	const { error } = await supabase.from('courses').update(course).eq('id', course.id);
	if (error) throw new Error(error.message);
};
export const isCourseCodeTaken = async (code: string) => {
	const { count } = await supabase
		.from('courses')
		.select('*', { count: 'exact', head: true })
		.eq('code', code);
	return !!count;
};
export const isCourseCodeOverwrite = async (id: string, code: string) => {
	const { count } = await supabase
		.from('courses')
		.select('*', { count: 'exact', head: true })
		.eq('code', code)
		.neq('id', id);
	return !!count;
};
export const getCoursesCount = async (span: string = 'all') => {
	const query = supabase
		.from('courses')
		.select('*', { count: 'exact', head: true })
		.eq('is_archived', false);
	if (span === 'week') query.gt('created_at', Date.now() - WEEK);
	else if (span === 'month') query.gt('created_at', Date.now() - MONTH);
	else if (span === 'year') query.gt('created_at', Date.now() - YEAR);
	const { count } = await query;
	return count || 0;
};
