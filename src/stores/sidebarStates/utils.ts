// IMPORTED LIB-UTILS
import { get } from 'svelte/store';
// IMPORTED STATES
import { isSMUp } from '$stores/mediaStates';
import { isOpen } from './states';

// UTILS
export const toggleSidebar = () => isOpen.update((v) => !v);
export const initializeSidebarStates = () => {
	if (get(isSMUp)) isOpen.set(true);
};
