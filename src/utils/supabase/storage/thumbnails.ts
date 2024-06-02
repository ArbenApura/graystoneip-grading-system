// IMPORTED UTILS
import { generateId } from '$utils/helpers';
import { supabase } from '..';

// CONSTANTS
const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/thumbnails/`;

// UTILS
export const uploadThumbnail = async (file: File) => {
	const id = generateId();
	const { data, error } = await supabase.storage
		.from('thumbnails')
		.upload(`${id}.png`, file, { upsert: true });
	if (error) throw new Error(error.message);
	return BASE_URL + data.path;
};
export const deleteThumbnail = async (path: string) => {
	const { error } = await supabase.storage
		.from('thumbnails')
		.remove([path.replace(BASE_URL, '')]);
	if (error) throw new Error(error.message);
};
