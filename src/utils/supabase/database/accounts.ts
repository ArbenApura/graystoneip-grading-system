// IMPORTED TYPES
import type { Account, AccountType } from '$types/credentials';
// IMPORTED UTILS
import { deleteAvatar, supabase } from '..';

// UTILS
export const insertAccount = async (account: Account) => {
	if (await isEmailTaken(account.email)) throw new Error('Email is already taken!');
	const { error } = await supabase.from('accounts').insert(account);
	if (error) throw new Error(error.message);
};
export const selectAccounts = async ({ type, search }: { type: AccountType; search: string }) => {
	let query = supabase.from('accounts').select().eq('account_type', type);
	if (search) query.ilike('full_name', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data as Account[];
};
export const deleteAccount = async (id: string) => {
	const { error } = await supabase.from('accounts').delete().eq('id', id);
	if (error) throw new Error(error.message);
	await deleteAvatar(id);
};
export const updateAccount = async (account: Account) => {
	if (await isEmailOverwrite(account.id, account.email))
		throw new Error('Email is already taken!');
	const { error } = await supabase.from('accounts').update(account).eq('id', account.id);
	if (error) throw new Error(error.message);
};
export const isEmailTaken = async (email: string) => {
	const { count } = await supabase.from('accounts').select().eq('email', email);
	return !!count;
};
export const isEmailOverwrite = async (id: string, email: string) => {
	const { count } = await supabase.from('accounts').select().eq('email', email).neq('id', id);
	return !!count;
};
export const selectAccountByEmailAndPassword = async (email: string, password: string) => {
	const { data, error } = await supabase.from('accounts').select().match({ email, password });
	if (error) throw new Error(error.message);
	if (!data.length) throw new Error('Incorrect email or password!');
	return data[0] as Account;
};
export const getProfessorsCount = async () => {
	const { count } = await supabase.from('accounts').select().eq('account_type', 'professors');
	return count || 0;
};
export const getStudentsCount = async () => {
	const { count } = await supabase.from('accounts').select().eq('account_type', 'students');
	return count || 0;
};
