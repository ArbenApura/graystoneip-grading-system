// IMPORTED TYPES
import type { Program } from '$types/curriculum';
// IMPORTED UTILS
import { MONTH, WEEK, YEAR } from '$utils/constants';
import { supabase } from '..';

// UTILS
export const insertProgram = async (program: Program) => {
	if (await isProgramCodeTaken(program.code)) throw new Error('Code is already taken!');
	const { error } = await supabase.from('programs').insert(program);
	if (error) throw new Error(error.message);
};
export const selectProgram = async (id: string) => {
	const { data, error } = await supabase.from('programs').select().match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Program not found!');
	return data[0] as Program;
};
export const selectPrograms = async ({
	search,
	is_archived,
}: {
	search?: string;
	is_archived?: boolean;
}) => {
	let query = supabase
		.from('programs')
		.select()
		.order('code')
		.eq('is_archived', typeof is_archived === 'undefined' ? false : is_archived);
	if (search) query.ilike('code', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data as Program[]) || [];
};
export const archiveProgram = async (id: string) => {
	const { error } = await supabase.from('programs').update({ is_archived: true }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const unarchiveProgram = async (id: string) => {
	const { error } = await supabase.from('programs').update({ is_archived: false }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const updateProgram = async (program: Program) => {
	if (await isProgramCodeOverwrite(program.id, program.code))
		throw new Error('Code is already taken!');
	const { error } = await supabase.from('programs').update(program).eq('id', program.id);
	if (error) throw new Error(error.message);
};
export const isProgramCodeTaken = async (code: string) => {
	const { count } = await supabase
		.from('programs')
		.select('*', { count: 'exact', head: true })
		.eq('code', code);
	return !!count;
};
export const isProgramCodeOverwrite = async (id: string, code: string) => {
	const { count } = await supabase
		.from('programs')
		.select('*', { count: 'exact', head: true })
		.eq('code', code)
		.neq('id', id);
	return !!count;
};
export const getProgramsCount = async (span: string = 'all') => {
	const query = supabase
		.from('programs')
		.select('*', { count: 'exact', head: true })
		.eq('is_archived', false);
	if (span === 'week') query.gt('created_at', Date.now() - WEEK);
	else if (span === 'month') query.gt('created_at', Date.now() - MONTH);
	else if (span === 'year') query.gt('created_at', Date.now() - YEAR);
	const { count } = await query;
	return count || 0;
};
