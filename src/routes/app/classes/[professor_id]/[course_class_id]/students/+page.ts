// IMPORTED LIB-TYPES
import type { EntryGenerator } from './$types';
// IMPORTED UTILS
import { selectAccounts, selectCourseClasses } from '$utils/supabase';

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
