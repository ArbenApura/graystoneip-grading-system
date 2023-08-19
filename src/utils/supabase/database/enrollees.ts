// IMPORTED TYPES
import type { Enrollee, EnrolleeData } from '$types/master-list';
// IMPORTED UTILS
import { selectCourseStudent, selectCourseStudents, supabase } from '..';

// UTILS
export const insertEnrollee = async (enrollee: Enrollee) => {
	if (await isAlreadyEnrolled(enrollee)) throw new Error('Enrollee is already enrolled!');
	const { error } = await supabase.from('enrollees').insert(enrollee);
	if (error) throw new Error(error.message);
};
export const selectEnrollee = async (id: string) => {
	const { data, error } = await supabase
		.from('enrollees')
		.select('*, account: accounts(*), program: programs(*)')
		.match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Enrollee not found!');
	return data[0] as unknown as EnrolleeData;
};
export const selectEnrollees = async ({
	search,
	semester,
	school_year,
	is_archived,
	not_in_course_class_id,
}: {
	search?: string;
	semester?: string;
	school_year?: string;
	is_archived?: boolean;
	not_in_course_class_id?: string;
}) => {
	let query = supabase
		.from('enrollees')
		.select('*, account: accounts(*), program: programs(*)')
		.order('student_number')
		.eq('is_archived', typeof is_archived === 'undefined' ? false : is_archived);
	if (semester) query.match({ semester });
	if (school_year) query.match({ school_year });
	if (search) query.ilike('search_key', `%${search}%`);
	const { data, error } = await query;
	let enrollees = (data as unknown as EnrolleeData[]) || [];
	if (not_in_course_class_id) {
		const courseStudents = await selectCourseStudents({
			course_class_id: not_in_course_class_id,
		});
		enrollees = enrollees.filter(
			(enrollee) =>
				!courseStudents.map(({ enrollee_id }) => enrollee_id).includes(enrollee.id),
		);
	}
	if (error) throw new Error(error.message);
	return enrollees;
};
export const archiveEnrollee = async (id: string) => {
	const { error } = await supabase.from('enrollees').update({ is_archived: true }).match({ id });
	if (error) throw new Error(error.message);
};
export const unarchiveEnrollee = async (id: string) => {
	const { error } = await supabase.from('enrollees').update({ is_archived: false }).match({ id });
	if (error) throw new Error(error.message);
};
export const updateEnrollee = async (enrollee: Enrollee) => {
	const { error } = await supabase.from('enrollees').update(enrollee).match({ id: enrollee.id });
	if (error) throw new Error(error.message);
};
export const isAlreadyEnrolled = async ({
	account_id,
	semester,
	school_year,
	program_id,
}: Enrollee) => {
	const { count } = await supabase
		.from('enrollees')
		.select('*', { count: 'exact', head: true })
		.match({ account_id, semester, school_year, program_id });
	return !!count;
};
