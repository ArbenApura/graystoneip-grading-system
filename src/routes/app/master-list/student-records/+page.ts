// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectStudentRecords, selectPrograms } from '$utils/supabase';

export const load = (async () => {
	const studentRecords = await selectStudentRecords({});
	const programs = await selectPrograms({});
	return { studentRecords, programs };
}) satisfies PageLoad;
