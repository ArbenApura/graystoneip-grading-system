// IMPORTED TYPES
import type { Account } from '$types/credentials';
// IMPORTED LIB-UTILS
import { writable } from 'svelte/store';

// DEFAULT STATES
export const DEFAULT_ACCOUNT: Account = {
	id: '',
	last_name: '',
	first_name: '',
	middle_name: '',
	full_name: '',
	gender: '',
	birth_date: 0,
	address: '',
	contact_number: '',
	account_type: 'student',
	avatar: '',
	email: '',
	password: '',
	created_at: 0,
};

// STATES
export const account = writable<Account>(DEFAULT_ACCOUNT);
export const isLogined = writable<boolean>(false);
export const authStates = { account, isLogined };
