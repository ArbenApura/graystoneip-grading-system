// IMPORTED TYPES
import type { Course, Program } from './curriculum';

// TYPES
export type AccountType = 'admin' | 'professor' | 'student';
export type Account = {
	id: string;
	last_name: string;
	first_name: string;
	middle_name: string;
	full_name: string;
	gender: string;
	birth_date: number;
	address: string;
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
	student_number: string;
	year: number;
	section: string;
	semester: number;
	school_year: string;
	search_key: string;
	is_archived?: boolean;
	created_at: number;
};
export type EnrolleeData = {
	account: Account;
	program: Program;
	enrollee: Enrollee;
};
