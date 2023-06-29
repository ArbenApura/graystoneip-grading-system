export type Course = {
	id: string;
	code: string;
	prerequisite: string;
	description: string;
	units: number;
	hours: number;
	createdAt: number;
};
export type Program = {
	id: string;
	code: string;
	description: string;
	createdAt: number;
};
