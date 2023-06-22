// IMPORTED LIB-UTILS
import { writable } from 'svelte/store';
// IMPORTED UTILS
import { initializeMediaStates } from './mediaStates';

// STATES
export const isInitialized = writable<boolean>(false);
export const stores = { isInitialized };

// UTILS
export const initializeStores = () => {
	initializeMediaStates();
	isInitialized.set(true);
};
