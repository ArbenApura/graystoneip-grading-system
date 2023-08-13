// IMPORTED TYPES
import type { Account } from '$types/credentials';
// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import {
	getCoursesCount,
	getProfessorsCount,
	getProgramsCount,
	getStudentsCount,
	selectNewProfessors,
} from '$utils/supabase';

export const load = (async () => {
	let professorsCount = 0,
		studentsCount = 0,
		coursesCount = 0,
		programsCount = 0,
		professorsCountWeek = 0,
		studentsCountWeek = 0,
		coursesCountWeek = 0,
		programsCountWeek = 0;
	let newProfessorsWeek: Account[] = [];
	await Promise.all([
		(professorsCount = await getProfessorsCount()),
		(studentsCount = await getStudentsCount()),
		(coursesCount = await getCoursesCount()),
		(programsCount = await getProgramsCount()),
		(professorsCountWeek = await getProfessorsCount('week')),
		(studentsCountWeek = await getStudentsCount('week')),
		(coursesCountWeek = await getCoursesCount('week')),
		(programsCountWeek = await getProgramsCount('week')),
		(newProfessorsWeek = await selectNewProfessors('week')),
	]);
	return {
		professorsCount,
		studentsCount,
		coursesCount,
		programsCount,
		professorsCountWeek,
		studentsCountWeek,
		coursesCountWeek,
		programsCountWeek,
		newProfessorsWeek,
	};
}) satisfies PageLoad;
