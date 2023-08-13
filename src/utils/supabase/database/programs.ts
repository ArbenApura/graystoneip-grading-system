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
export const selectPrograms = async (search: string = '') => {
	let query = supabase.from('programs').select();
	if (search) query.ilike('code', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data as Program[]) || [];
};
export const deleteProgram = async (id: string) => {
	const { error } = await supabase.from('programs').delete().eq('id', id);
	if (error) throw new Error(error.message);
};
export const updateProgram = async (program: Program) => {
	if (await isProgramCodeOverwrite(program.id, program.code))
		throw new Error('Code is already taken!');
	const { error } = await supabase.from('programs').update(program).eq('id', program.id);
	if (error) throw new Error(error.message);
};
export const isProgramCodeTaken = async (code: string) => {
	const { data } = await supabase
		.from('programs')
		.select('*', { count: 'exact', head: true })
		.eq('code', code);
	return !!data;
};
export const isProgramCodeOverwrite = async (id: string, code: string) => {
	const { data } = await supabase
		.from('programs')
		.select('*', { count: 'exact', head: true })
		.eq('code', code)
		.neq('id', id);
	return !!data;
};
export const getProgramsCount = async (span: string = 'all') => {
	const query = supabase.from('programs').select('*', { count: 'exact', head: true });
	if (span === 'week') query.gt('created_at', Date.now() - WEEK);
	else if (span === 'month') query.gt('created_at', Date.now() - MONTH);
	else if (span === 'year') query.gt('created_at', Date.now() - YEAR);
	const { count } = await query;
	return count || 0;
};
