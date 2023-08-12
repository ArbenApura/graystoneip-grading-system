// IMPORTED STATES
import { isSMUp } from '$stores/mediaStates';
import { sidebarStates, isOpen } from './states';
// IMPORTED LIB-UTILS
import { get } from 'svelte/store';
// IMPORTED UTILS
import { decrypt, encrypt } from '$utils/helpers';

// UTILS
export const toggleSidebar = () => isOpen.update((v) => !v);
export const saveData = () => {
	if (typeof localStorage === 'undefined') return;
	const encrypted = encrypt(
		JSON.stringify({
			isOpen: get(isOpen),
		}),
	);
	localStorage.setItem('sidebarStates', encrypted);
};
export const loadData = async () => {
	if (typeof localStorage === 'undefined') return;
	const encrypted = localStorage.getItem('sidebarStates');
	if (!encrypted) return;
	const decrypted = decrypt(encrypted);
	if (!decrypted) return;
	const { isOpen } = decrypted;
	sidebarStates.isOpen.set(isOpen);
};
export const initializeSidebarStates = () => {
	if (get(isSMUp)) isOpen.set(true);
	loadData();
};
