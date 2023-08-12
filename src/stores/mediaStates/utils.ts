// IMPORTED LIB-UTILS
import { get } from 'svelte/store';
// IMPORTED UTILS
import { breakpoints } from '$utils/breakpoints';
// IMPORTED STATES
import { isInitialized } from '..';
import { mediaStates } from './states';

// UTILS
export const updateMedia = () => {
	if (get(isInitialized)) return;

	const winWidth = window.innerWidth;

	mediaStates.isXS.set(winWidth < breakpoints.sm);
	mediaStates.isSM.set(winWidth >= breakpoints.sm && winWidth < breakpoints.md);
	mediaStates.isMD.set(winWidth >= breakpoints.md && winWidth < breakpoints.lg);
	mediaStates.isLG.set(winWidth >= breakpoints.lg && winWidth < breakpoints.xl);
	mediaStates.isXL.set(winWidth >= breakpoints.xl && winWidth < breakpoints['2xl']);
	mediaStates.is2XL.set(winWidth >= breakpoints['2xl']);

	mediaStates.isSMDown.set(winWidth < breakpoints.md);
	mediaStates.isMDDown.set(winWidth < breakpoints.lg);
	mediaStates.isLGDown.set(winWidth < breakpoints.xl);
	mediaStates.isXLDown.set(winWidth < breakpoints['2xl']);

	mediaStates.isXSUp.set(winWidth > breakpoints.sm);
	mediaStates.isSMUp.set(winWidth > breakpoints.md);
	mediaStates.isMDUp.set(winWidth > breakpoints.lg);
	mediaStates.isLGUp.set(winWidth > breakpoints.xl);
	mediaStates.isXLUp.set(winWidth > breakpoints['2xl']);
};
export const initializeMediaStates = () => {
	if (get(isInitialized)) updateMedia();
};
