// IMPORTED TYPES
import type { Enrollee, EnrolleeData } from '$types/master-list';
// IMPORTED UTILS
import { selectAccount, selectProgram, supabase } from '..';

// UTILS
export const insertEnrollee = async (enrollee: Enrollee) => {
	if (await isAlreadyEnrolled(enrollee)) throw new Error('Enrollee is already enrolled!');
	const { error } = await supabase.from('enrollees').insert(enrollee);
	if (error) throw new Error(error.message);
};
export const selectEnrollees = async ({
	search,
	semester,
	school_year,
	is_archived,
}: {
	search?: string;
	semester?: string;
	school_year?: string;
	is_archived?: boolean;
}) => {
	let query = supabase
		.from('enrollees')
		.select()
		.order('student_number')
		.eq('is_archived', typeof is_archived === 'undefined' ? false : is_archived);
	if (semester) query.match({ semester });
	if (school_year) query.match({ school_year });
	if (search) query.ilike('search_key', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	const enrollees: EnrolleeData[] = [];
	await Promise.all(
		(data as Enrollee[]).map(async (enrollee) =>
			enrollees.push({
				account: await selectAccount(enrollee.account_id),
				program: await selectProgram(enrollee.program_id),
				enrollee,
			}),
		),
	);
	return enrollees;
};
export const archiveEnrollee = async (id: string) => {
	const { error } = await supabase.from('enrollees').update({ is_archived: true }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const unarchiveEnrollee = async (id: string) => {
	const { error } = await supabase.from('enrollees').update({ is_archived: false }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const updateEnrollee = async (enrollee: Enrollee) => {
	const { error } = await supabase.from('enrollees').update(enrollee).eq('id', enrollee.id);
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
