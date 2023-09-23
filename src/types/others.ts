// IMPORTED TYPES
import type { Account } from './master-list';

// TYPES
export type RecoveryRequest = {
	id: string;
	source: string;
	created_at: number;
};
export type RecoveryRequestData = {
	account: Account;
	recoveryRequest: RecoveryRequest;
};
