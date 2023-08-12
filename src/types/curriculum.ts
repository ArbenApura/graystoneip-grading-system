// TYPES
export type Program = {
	id: string;
	code: string;
	description: string;
	created_at: number;
};
export type Course = {
	id: string;
	code: string;
	description: string;
	units: number;
	hours: number;
	created_at: number;
};
