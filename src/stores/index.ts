// IMPORTED LIB-UTILS
import { writable } from 'svelte/store';
// IMPORTED UTILS
import { initializeMediaStates } from './mediaStates';
import { initializeSidebarStates } from './sidebarStates';
import { initializeAuthStates } from './authStates';

// STATES
export const isInitialized = writable<boolean>(false);
export const stores = { isInitialized };

// UTILS
export const initializeStores = async () => {
	await initializeAuthStates();
	initializeMediaStates();
	initializeSidebarStates();
	setTimeout(() => isInitialized.set(true), 500);
};
