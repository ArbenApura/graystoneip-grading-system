export type AccountType = 'admin' | 'professor' | 'student';
export type Account = {
	id: string;
	firstName: string;
	lastName: string;
	middleName: string;
	gender: string;
	birthDate: number;
	address: string;
	contactNo: string;
	accountType: AccountType;
	email: string;
	password: string;
	dateCreated: number;
};
