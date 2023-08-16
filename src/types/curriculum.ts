// IMPORTED TYPES
import type { Account } from './master-list';

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
export type CourseClass = {
	id: string;
	professor_id: string;
	course_id: string;
	name: string;
	semester: string;
	school_year: string;
	created_at: number;
};
export type CourseClassData = {
	professor: Account;
	courseClass: CourseClass;
};
