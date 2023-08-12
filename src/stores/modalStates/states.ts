// IMPORTED TYPES
import type { ModalItem } from './types';
// IMPORTED LIB-UTILS
import { writable, get } from 'svelte/store';
// IMPORTED STATES
import { isInitialized } from '..';
import { observeBodyOverflow } from './utils';

// STATES
export const modals = writable<ModalItem[]>([]);
export const customModals = writable<string[]>([]);
export const modalStates = { modals, customModals };

// SUBSCRIPTIONS
modals.subscribe(() => {
	try {
		get(isInitialized) && observeBodyOverflow();
	} catch {}
});
customModals.subscribe(() => {
	try {
		get(isInitialized) && observeBodyOverflow();
	} catch {}
});
