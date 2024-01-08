// IMPORTED TYPES
import type { Account, StudentRecord, StudentRecordData } from './master-list';

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
	mode: string;
	is_archived?: boolean;
	created_at: number;
};
export type CourseClass = {
	id: string;
	instructor_id: string;
	course_id: string;
	name: string;
	semester: string;
	school_year: string;
	created_at: number;
};
export type CourseClassData = CourseClass & {
	instructor: Account;
	course: Course;
};
export type CourseStudent = {
	id: string;
	course_class_id: string;
	student_record_id: string;
	search_key: string;
	semester: string;
	school_year: string;
	grade: string;
	is_grade_released: boolean;
	created_at: number;
};
export type CourseStudentData = CourseStudent & {
	student_record: StudentRecordData;
	course_class: CourseClassData;
};
export type Criteria = {
	id: string;
	course_class_id: string;
	name: string;
	percentage: number;
	term: string;
	created_at: number;
};
export type CriteriaData = Criteria & {
	course_class: CourseClassData;
};
export type CriteriaItem = {
	id: string;
	criteria_id: string;
	name: string;
	total: number;
	is_assessment: boolean;
	is_open: boolean;
	questions: AssessmentQuestion[];
	title: string;
	description: string;
	created_at: number;
};
export type CriteriaItemData = CriteriaItem & {
	criteria: CriteriaData;
};
export type CriteriaGrade = {
	id: string;
	criteria_item_id: string;
	course_class_id: string;
	course_student_id: string;
	score: number;
	created_at: number;
};
export type CriteriaGradeData = CriteriaGrade & {
	criteria_item: CriteriaItemData;
	course_student: CourseStudentData;
};
export type AdvanceCriteriaItem = {
	criteria_item: CriteriaItemData;
	criteria_grades: CriteriaGradeData[];
};
export type AdvanceCriteria = {
	criteria: CriteriaData;
	advance_criteria_items: AdvanceCriteriaItem[];
};
export type AssessmentQuestionType = 'multiple-choice' | 'short-answer';
export type AssessmentQuestionChoice = {
	id: string;
	letter: string;
	label: string;
};
export type AssessmentQuestion = {
	id: string;
	question: string;
	type: AssessmentQuestionType;
	order: number;
	choices: AssessmentQuestionChoice[];
	answers: string[];
	points: number;
};
export type AssessmentStudentItem = {
	student_records: (StudentRecord & {
		course_students: CourseStudent[];
	})[];
};
