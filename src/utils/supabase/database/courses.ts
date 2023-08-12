// IMPORTED TYPES
import type { Course } from '$types/curriculum';
// IMPORTED UTILS
import { supabase } from '..';

// UTILS
export const insertCourse = async (course: Course) => {
	if (await isCodeTaken(course.code)) throw new Error('Code is already taken!');
	const { error } = await supabase.from('courses').insert(course);
	if (error) throw new Error(error.message);
};
export const selectCourses = async (search: string = '') => {
	let query = supabase.from('courses').select();
	if (search) query.ilike('code', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data as Course[];
};
export const deleteCourse = async (id: string) => {
	const { error } = await supabase.from('courses').delete().eq('id', id);
	if (error) throw new Error(error.message);
};
export const updateCourse = async (course: Course) => {
	if (await isCodeOverwrite(course.id, course.code)) throw new Error('Code is already taken!');
	const { error } = await supabase.from('courses').update(course).eq('id', course.id);
	if (error) throw new Error(error.message);
};
export const isCodeTaken = async (code: string) => {
	const { count } = await supabase.from('courses').select().eq('code', code);
	return !!count;
};
export const isCodeOverwrite = async (id: string, code: string) => {
	const { count } = await supabase.from('courses').select().eq('code', code).neq('id', id);
	return !!count;
};
export const getCoursesCount = async () => {
	const { count } = await supabase.from('courses').select();
	return count || 0;
};
