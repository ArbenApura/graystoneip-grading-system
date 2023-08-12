// IMPORTED LIB-UTILS
import { writable } from 'svelte/store';
// IMPORTED UTILS
import { saveData } from './utils';

// STATES
export const isOpen = writable<boolean>(false);
export const sidebarStates = { isOpen };

// SUBSCRIPTIONS
isOpen.subscribe(saveData);
