// IMPORTED TYPES
import type { Account, AccountType } from '$types/master-list';
// IMPORTED UTILS
import { MONTH, WEEK, YEAR } from '$utils/constants';
import { supabase } from '..';

// UTILS
export const insertAccount = async (account: Account) => {
	if (await isEmailTaken(account.email)) throw new Error('Email is already taken!');
	const { error } = await supabase.from('accounts').insert(account);
	if (error) throw new Error(error.message);
};
export const selectAccount = async (id: string) => {
	const { data, error } = await supabase.from('accounts').select().match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Account not found!');
	return data[0] as Account;
};
export const selectAccounts = async ({
	type,
	search,
	is_archived,
}: {
	type: AccountType;
	search?: string;
	is_archived?: boolean;
}) => {
	let query = supabase
		.from('accounts')
		.select()
		.order('last_name')
		.eq('account_type', type)
		.eq('is_archived', typeof is_archived === 'undefined' ? false : is_archived);
	if (search) query.ilike('full_name', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data as Account[]) || [];
};
export const archiveAccount = async (id: string) => {
	const { error } = await supabase.from('accounts').update({ is_archived: true }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const unarchiveAccount = async (id: string) => {
	const { error } = await supabase.from('accounts').update({ is_archived: false }).eq('id', id);
	if (error) throw new Error(error.message);
};
export const updateAccount = async (account: Account) => {
	if (await isEmailOverwrite(account.id, account.email))
		throw new Error('Email is already taken!');
	const { error } = await supabase.from('accounts').update(account).eq('id', account.id);
	if (error) throw new Error(error.message);
};
export const isEmailTaken = async (email: string) => {
	const { count } = await supabase
		.from('accounts')
		.select('*', { count: 'exact', head: true })
		.eq('email', email);
	return !!count;
};
export const isEmailOverwrite = async (id: string, email: string) => {
	const { count } = await supabase
		.from('accounts')
		.select('*', { count: 'exact', head: true })
		.eq('email', email)
		.neq('id', id);
	return !!count;
};
export const selectAccountByEmailAndPassword = async (email: string, password: string) => {
	const { data, error } = await supabase.from('accounts').select().match({ email, password });
	if (error) throw new Error(error.message);
	if (!data.length) throw new Error('Incorrect email or password!');
	const account = data[0] as Account;
	if (account.is_archived) throw new Error('Account unavaible!');
	return account;
};
export const getProfessorsCount = async (span: string = 'all') => {
	const query = supabase
		.from('accounts')
		.select('*', { count: 'exact', head: true })
		.eq('account_type', 'professor')
		.eq('is_archived', false);
	if (span === 'week') query.gt('created_at', Date.now() - WEEK);
	else if (span === 'month') query.gt('created_at', Date.now() - MONTH);
	else if (span === 'year') query.gt('created_at', Date.now() - YEAR);
	const { count } = await query;
	return count || 0;
};
export const getStudentsCount = async (span: string = 'all') => {
	const query = supabase
		.from('accounts')
		.select('*', { count: 'exact', head: true })
		.eq('account_type', 'student')
		.eq('is_archived', false);
	if (span === 'week') query.gt('created_at', Date.now() - WEEK);
	else if (span === 'month') query.gt('created_at', Date.now() - MONTH);
	else if (span === 'year') query.gt('created_at', Date.now() - YEAR);
	const { count } = await query;
	return count || 0;
};
export const selectNewProfessors = async (span: string = 'all') => {
	const query = supabase
		.from('accounts')
		.select()
		.eq('account_type', 'professor')
		.eq('is_archived', false);
	if (span === 'week') query.gt('created_at', Date.now() - WEEK);
	else if (span === 'month') query.gt('created_at', Date.now() - MONTH);
	else if (span === 'year') query.gt('created_at', Date.now() - YEAR);
	query.limit(8);
	const { data } = await query;
	return (data as Account[]) || [];
};
