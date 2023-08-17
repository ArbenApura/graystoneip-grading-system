// IMPORTED LIB-TYPES
import type { PageLoad, EntryGenerator } from './$types';
// IMPORTED UTILS
import { selectAccount, selectAccounts, selectCourseClasses, selectCourses } from '$utils/supabase';

export const load = (async ({ params }) => {
	const courseClasses = await selectCourseClasses({
		semester: '1st',
		school_year: '2023-2024',
		professor_id: params.professor_id,
	});
	const courses = await selectCourses({});
	const professor = await selectAccount(params.professor_id);
	return { courseClasses, courses, professor };
}) satisfies PageLoad;

export const entries: EntryGenerator = async () => {
	const professors = await selectAccounts({ type: 'professor' });
	return professors.map((professor) => ({ professor_id: professor.id }));
};
