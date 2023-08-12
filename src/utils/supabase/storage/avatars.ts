// IMPORTED UTILS
import { generateId } from '$utils/helpers';
import { supabase } from '..';

// CONSTANTS
const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/`;

// UTILS
export const uploadAvatar = async (file: File) => {
	const id = generateId();
	const { data, error } = await supabase.storage
		.from('avatars')
		.upload(`${id}.png`, file, { upsert: true });
	if (error) throw new Error(error.message);
	return BASE_URL + data.path;
};
export const deleteAvatar = async (path: string) => {
	const { error } = await supabase.storage.from('avatars').remove([path.replace(BASE_URL, '')]);
	if (error) throw new Error(error.message);
};
