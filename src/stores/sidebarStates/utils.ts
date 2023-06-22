// IMPORTED STATES
import { isOpen } from './states';

// UTILS
export const toggleSidebar = () => isOpen.update((v) => !v);
