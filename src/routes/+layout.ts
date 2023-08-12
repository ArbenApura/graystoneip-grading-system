// IMPORTED LIB-TYPES
import type { LayoutLoad } from './$types';
// IMPORTED UTILS
import { initializeStores } from '$stores/index';
// IMPORTED STYLES
import '$styles/tailwind.scss';
import '$styles/index.scss';
import '$styles/libs/nprogress.scss';

export const ssr = false,
	prerender = true;

export const load = (async () => {
	if (typeof window !== 'undefined') await initializeStores(true);
	return {};
}) satisfies LayoutLoad;
