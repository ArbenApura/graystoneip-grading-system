// IMPORTED LIB-UTILS
import { writable } from 'svelte/store';

// STATES
export const isOpen = writable<boolean>(false);
export const sidebarStates = { isOpen };
