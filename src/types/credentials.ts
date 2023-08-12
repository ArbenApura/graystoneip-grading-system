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
	created_at: number;
};
