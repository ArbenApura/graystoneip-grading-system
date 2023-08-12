// IMPORTED LIB-UTILS
import { get } from 'svelte/store';
// IMPORTED UTILS
import { generateId } from '$utils/helpers';
// IMPORTED STATES
import { modals, customModals } from './states';

// UTILS
export const createInfoModal = ({ title, message }: { title?: string; message?: string }) => {
	modals.update((modals) => [...modals, { id: generateId(), type: 'info', title, message }]);
};
export const createErrorModal = ({ title, message }: { title?: string; message?: string }) => {
	modals.update((modals) => [...modals, { id: generateId(), type: 'error', title, message }]);
};
export const createSuccessModal = ({ title, message }: { title?: string; message?: string }) => {
	modals.update((modals) => [...modals, { id: generateId(), type: 'success', title, message }]);
};
export const createLoadingModal = ({ title, message }: { title?: string; message?: string }) => {
	const id = generateId();
	modals.update((modals) => [...modals, { id, type: 'loading', title, message }]);
	return id;
};
export const createConfirmationModal = ({
	title,
	message,
	handleProceed,
}: {
	title?: string;
	message?: string;
	handleProceed: () => void | Promise<void>;
}) => {
	modals.update((modals) => [
		...modals,
		{ id: generateId(), type: 'confirmation', title, message, handleProceed },
	]);
};
export const createVerificationModal = ({
	title,
	message,
	handleProceed,
}: {
	title?: string;
	message?: string;
	handleProceed: () => void | Promise<void>;
}) => {
	modals.update((modals) => [
		...modals,
		{ id: generateId(), type: 'verification', title, message, handleProceed },
	]);
};
export const removeModal = (id: string) =>
	modals.update((modals) => modals.filter((modal) => modal.id !== id));
export const createCustomModal = (id: string) =>
	customModals.update((customModals) => [...customModals, id]);
export const removeCustomModal = (id: string) =>
	customModals.update((customModals) => customModals.filter((customModal) => customModal !== id));
export const observeBodyOverflow = () => {
	if (get(modals).length || get(customModals).length) document.body.classList.add('no-scroll');
	else document.body.classList.remove('no-scroll');
};
