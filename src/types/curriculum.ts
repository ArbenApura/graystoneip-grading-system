// IMPORTED TYPES
import type { Account, Enrollee, EnrolleeData } from './master-list';

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
export type CourseClassData = CourseClass & {
	professor: Account;
	course: Course;
};
export type CourseStudent = {
	id: string;
	course_class_id: string;
	enrollee_id: string;
	search_key: string;
	semester: string;
	school_year: string;
	grade: string;
	is_grade_released: boolean;
	created_at: number;
};
export type CourseStudentData = CourseStudent & {
	enrollee: EnrolleeData;
	course_class: CourseClassData;
};
