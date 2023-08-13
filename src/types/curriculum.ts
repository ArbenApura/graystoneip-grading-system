// TYPES
export type Program = {
	id: string;
	code: string;
	description: string;
	is_archived?: boolean;
	created_at: number;
};
export type Course = {
	id: string;
	code: string;
	description: string;
	units: number;
	hours: number;
	is_archived?: boolean;
	created_at: number;
};
