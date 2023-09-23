// IMPORTED TYPES
import type { Program } from './curriculum';

// TYPES
export type AccountType = 'admin' | 'instructor' | 'student';
export type Account = {
	id: string;
	last_name: string;
	first_name: string;
	middle_name: string;
	full_name: string;
	gender: string;
	contact_number: string;
	account_type: AccountType;
	avatar: string;
	email: string;
	password: string;
	is_archived?: boolean;
	created_at: number;
};
export type Enrollee = {
	id: string;
	account_id: string;
	program_id: string;
	year: string;
	section: string;
	semester: string;
	school_year: string;
	search_key: string;
	is_archived?: boolean;
	created_at: number;
};
export type EnrolleeData = Enrollee & {
	account: Account;
	program: Program;
};
