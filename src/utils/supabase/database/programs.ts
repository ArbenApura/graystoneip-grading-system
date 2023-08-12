// IMPORTED TYPES
import type { Program } from '$types/curriculum';
// IMPORTED UTILS
import { supabase } from '..';

// UTILS
export const insertProgram = async (program: Program) => {
	if (await isCodeTaken(program.code)) throw new Error('Code is already taken!');
	const { error } = await supabase.from('programs').insert(program);
	if (error) throw new Error(error.message);
};
export const selectPrograms = async (search: string = '') => {
	let query = supabase.from('programs').select();
	if (search) query.ilike('code', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data as Program[];
};
export const deleteProgram = async (id: string) => {
	const { error } = await supabase.from('programs').delete().eq('id', id);
	if (error) throw new Error(error.message);
};
export const updateProgram = async (program: Program) => {
	if (await isCodeOverwrite(program.id, program.code)) throw new Error('Code is already taken!');
	const { error } = await supabase.from('programs').update(program).eq('id', program.id);
	if (error) throw new Error(error.message);
};
export const isCodeTaken = async (code: string) => {
	const { count } = await supabase.from('programs').select().eq('code', code);
	return !!count;
};
export const isCodeOverwrite = async (id: string, code: string) => {
	const { count } = await supabase.from('programs').select().eq('code', code).neq('id', id);
	return !!count;
};
export const getProgramsCount = async () => {
	const { count } = await supabase.from('programs').select();
	return count || 0;
};
