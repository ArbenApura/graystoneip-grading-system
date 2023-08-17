// IMPORTED LIB-TYPES
import type { PageLoad, EntryGenerator } from './$types';
// IMPORTED UTILS
import {
	selectAccount,
	selectAccounts,
	selectCourseClass,
	selectCourseClasses,
} from '$utils/supabase';

export const load = (async ({ params }) => {
	const courseClass = await selectCourseClass(params.course_class_id);
	const professor = await selectAccount(params.professor_id);
	return { courseClass, professor };
}) satisfies PageLoad;

export const entries: EntryGenerator = async () => {
	const data: ReturnType<typeof entries> = [];
	const professors = await selectAccounts({ type: 'professor' });
	await Promise.all(
		professors.map(async (professor) => {
			const courseClasses = await selectCourseClasses({ professor_id: professor.id });
			courseClasses.map(({ courseClass }) =>
				data.push({
					professor_id: professor.id,
					course_class_id: courseClass.id,
				}),
			);
		}),
	);
	return data;
};
