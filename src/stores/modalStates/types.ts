// TYPES
export type ModalType =
	| 'info'
	| 'error'
	| 'success'
	| 'confirmation'
	| 'verification'
	| 'loading'
	| 'recovery';
export type ModalItem = {
	id: string;
	type: ModalType;
	title?: string;
	message?: string;
	handleProceed?: () => void | Promise<void>;
};
