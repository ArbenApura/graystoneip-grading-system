// IMPORTED TYPES
import type { CourseClass, CourseClassData } from '$types/curriculum';
// IMPORTED UTILS
import { selectAccount, supabase } from '..';

// UTILS
export const insertCourseClass = async (courseClass: CourseClass) => {
	const { error } = await supabase.from('classes').insert(courseClass);
	if (error) throw new Error(error.message);
};
export const selectCourseClass = async (id: string) => {
	const { data, error } = await supabase.from('classes').select().match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Class not found!');
	return data[0] as CourseClass;
};
export const selectCourseClasses = async ({
	search,
	semester,
	school_year,
}: {
	search?: string;
	semester?: string;
	school_year?: string;
}) => {
	let query = supabase.from('classes').select();
	if (semester) query.match({ semester });
	if (school_year) query.match({ school_year });
	if (search) query.ilike('name', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	const courseClasses: CourseClassData[] = [];
	await Promise.all(
		(data as CourseClass[]).map(async (courseClass) =>
			courseClasses.push({
				professor: await selectAccount(courseClass.professor_id),
				courseClass: courseClass,
			}),
		),
	);
	return courseClasses;
};
export const deleteCourseClass = async (id: string) => {
	const { error } = await supabase.from('classes').delete().match({ id });
	if (error) throw new Error(error.message);
};
export const updateCourseClass = async (courseClass: CourseClass) => {
	const { error } = await supabase
		.from('classes')
		.update(courseClass)
		.match({ id: courseClass.id });
	if (error) throw new Error(error.message);
};
