// IMPORTED TYPES
import type { CourseStudent, CourseStudentData } from '$types/curriculum';
// IMPORTED UTILS
import { supabase } from '..';

// UTILS
export const insertCourseStudent = async (courseStudent: CourseStudent) => {
	const { error } = await supabase.from('course_students').insert(courseStudent);
	if (error) throw new Error(error.message);
};
export const selectCourseStudent = async (id: string) => {
	const { data, error } = await supabase
		.from('course_students')
		.select(
			'*, course_class: course_classes(*, instructor: accounts(*), course: courses(*)), enrollee: enrollees(*, account: accounts(*), program: programs(*))',
		)
		.match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Class not found!');
	let courseStudent = data[0] as unknown as CourseStudentData;
	if (!courseStudent.enrollee.is_archived || !courseStudent.enrollee.account.is_archived)
		throw new Error('Course student unavailable!');
	return courseStudent;
};
export const selectCourseStudents = async ({
	search,
	semester,
	school_year,
	student_id,
	course_class_id,
	not_in_course_class_id,
}: {
	search?: string;
	semester?: string;
	school_year?: string;
	student_id?: string;
	course_class_id?: string;
	not_in_course_class_id?: string;
}) => {
	let query = supabase
		.from('course_students')
		.select(
			'*, course_class: course_classes(*, instructor: accounts(*), course: courses(*)), enrollee: enrollees(*, account: accounts(*), program: programs(*))',
		)
		.order('created_at', { ascending: false });
	if (course_class_id) query.match({ course_class_id });
	if (not_in_course_class_id) query.neq('course_class_id', not_in_course_class_id);
	if (search) query.ilike('search_key', `%${search}%`);
	if (semester) query.match({ semester });
	if (school_year) query.match({ school_year });
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	let courseStudents = (data as unknown as CourseStudentData[]) || [];
	if (student_id) {
		courseStudents = courseStudents.filter(
			(courseStudent) =>
				!courseStudent.enrollee.is_archived && !courseStudent.enrollee.account.is_archived,
		);
		courseStudents = courseStudents.filter(
			(courseStudent) => courseStudent.enrollee.account.id === student_id,
		);
	}
	return courseStudents;
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
export const releaseGrade = async (
	course_class_id: string,
	course_student_id: string,
	grade: string,
) => {
	const { error } = await supabase
		.from('course_students')
		.update({ is_grade_released: true, grade })
		.match({ id: course_student_id, course_class_id });
	if (error) throw new Error(error.message);
};
export const unreleaseGrades = async (course_class_id: string) => {
	const { error } = await supabase
		.from('course_students')
		.update({ is_grade_released: false })
		.match({ course_class_id });
	if (error) throw new Error(error.message);
};
