// IMPORTED TYPES
import type { Account } from './master-list';

// TYPES
export type RecoveryRequest = {
	id: string;
	email: string;
	created_at: number;
};
export type RecoveryRequestData = {
	account: Account;
	recoveryRequest: RecoveryRequest;
};
