// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import {
	getCoursesCount,
	getProfessorsCount,
	getProgramsCount,
	getStudentsCount,
} from '$utils/supabase';

export const load = (async () => {
	const professorsCount = await getProfessorsCount();
	const studentsCount = await getStudentsCount();
	const coursesCount = await getCoursesCount();
	const programsCount = await getProgramsCount();
	return { professorsCount, studentsCount, coursesCount, programsCount };
}) satisfies PageLoad;
