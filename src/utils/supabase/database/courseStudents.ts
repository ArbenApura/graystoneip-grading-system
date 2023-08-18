// IMPORTED TYPES
import type { CourseStudent, CourseStudentData } from '$types/curriculum';
// IMPORTED UTILS
import { selectAccount, selectCourse, selectCourseClass, supabase } from '..';

// UTILS
export const insertCourseStudent = async (courseStudent: CourseStudent) => {
	const { error } = await supabase.from('course_students').insert(courseStudent);
	if (error) throw new Error(error.message);
};
export const selectCourseStudent = async (id: string) => {
	const { data, error } = await supabase.from('course_students').select().match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Class not found!');
	return data[0] as CourseStudent;
};
export const selectCourseStudents = async ({
	search,
	course_class_id,
}: {
	search?: string;
	course_class_id?: string;
}) => {
	let query = supabase.from('course_students').select().order('created_at', { ascending: false });
	if (course_class_id) query.match({ course_class_id });
	if (search) query.ilike('search_key', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	const courseStudentes: CourseStudentData[] = [];
	await Promise.all(
		(data as CourseStudent[]).map(async (courseStudent) => {
			const courseClass = await selectCourseClass(courseStudent.course_class_id);
			courseStudentes.push({
				student: await selectAccount(courseStudent.student_id),
				course: await selectCourse(courseClass.course_id),
				courseClass,
				courseStudent,
			});
		}),
	);
	return courseStudentes;
};
export const deleteCourseStudents = async (course_class_id: string) => {
	const { error } = await supabase.from('course_students').delete().match({ course_class_id });
	if (error) throw new Error(error.message);
};
export const deleteCourseStudent = async (id: string) => {
	const { error } = await supabase.from('course_students').delete().match({ id });
	if (error) throw new Error(error.message);
};
export const updateCourseStudent = async (courseStudent: CourseStudent) => {
	const { error } = await supabase
		.from('course_students')
		.update(courseStudent)
		.match({ id: courseStudent.id });
	if (error) throw new Error(error.message);
};
export const updateCourseStudentTerm = async (
	course_class_id: string,
	semester: string,
	school_year: string,
) => {
	const { error } = await supabase
		.from('course_students')
		.update({ semester, school_year })
		.match({ course_class_id });
	if (error) throw new Error(error.message);
};
export const updateCourseStudentSearchKey = async (
	course_class_id: string,
	course_class_name: string,
) => {
	const { error } = await supabase
		.from('course_students')
		.update({ search_key: course_class_name })
		.match({ course_class_id });
	if (error) throw new Error(error.message);
};
export const getCourseClassStudentsCount = async (course_class_id: string) => {
	const { count } = await supabase
		.from('course_students')
		.select('*', { count: 'exact', head: true })
		.match({ course_class_id });
	return count || 0;
};
