// IMPORTED TYPES
import type { StudentRecord, StudentRecordData } from '$types/master-list';
// IMPORTED UTILS
import { selectCourseStudents, supabase } from '..';

// UTILS
export const insertStudentRecord = async (studentRecord: StudentRecord) => {
	if (await isAlreadyEnrolled(studentRecord))
		throw new Error('StudentRecord is already enrolled!');
	const { error } = await supabase.from('student_records').insert(studentRecord);
	if (error) throw new Error(error.message);
};
export const selectStudentRecord = async (id: string) => {
	const { data, error } = await supabase
		.from('student_records')
		.select('*, account: accounts(*), program: programs(*)')
		.match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Student Record not found!');
	return data[0] as unknown as StudentRecordData;
};
export const selectStudentRecords = async ({
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
		.from('student_records')
		.select('*, account: accounts(*), program: programs(*)')
		.eq('is_archived', typeof is_archived === 'undefined' ? false : is_archived);
	if (semester) query.match({ semester });
	if (school_year) query.match({ school_year });
	if (search) query.ilike('search_key', `%${search}%`);
	const { data, error } = await query;
	let studentRecords = (data as unknown as StudentRecordData[]) || [];
	if (not_in_course_class_id) {
		const courseStudents = await selectCourseStudents({
			course_class_id: not_in_course_class_id,
		});
		studentRecords = studentRecords.filter(
			(studentRecord) =>
				!courseStudents
					.map(({ student_record_id }) => student_record_id)
					.includes(studentRecord.id),
		);
	}
	if (error) throw new Error(error.message);
	return studentRecords;
};
export const archiveStudentRecord = async (id: string) => {
	const { error } = await supabase
		.from('student_records')
		.update({ is_archived: true })
		.match({ id });
	if (error) throw new Error(error.message);
};
export const unarchiveStudentRecord = async (id: string) => {
	const { error } = await supabase
		.from('student_records')
		.update({ is_archived: false })
		.match({ id });
	if (error) throw new Error(error.message);
};
export const updateStudentRecord = async (studentRecord: StudentRecord) => {
	const { error } = await supabase
		.from('student_records')
		.update(studentRecord)
		.match({ id: studentRecord.id });
	if (error) throw new Error(error.message);
};
export const isAlreadyEnrolled = async ({ account_id, semester, school_year }: StudentRecord) => {
	const { count } = await supabase
		.from('student_records')
		.select('*', { count: 'exact', head: true })
		.match({ account_id, semester, school_year });
	return !!count;
};
