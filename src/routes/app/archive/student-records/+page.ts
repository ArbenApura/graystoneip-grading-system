// IMPORTED LIB-TYPES
import type { PageLoad } from './$types';
// IMPORTED UTILS
import { selectStudentRecords, selectPrograms } from '$utils/supabase';

export const load = (async () => {
	const studentRecords = await selectStudentRecords({ is_archived: true });
	const programs = await selectPrograms({ is_archived: true });
	return { studentRecords, programs };
}) satisfies PageLoad;
