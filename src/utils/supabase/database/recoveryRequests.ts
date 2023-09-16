// IMPORTED TYPES
import type { RecoveryRequest, RecoveryRequestData } from '$types/others';
// IMPORTED UTILS
import { selectAccountByEmail, supabase } from '..';

// UTILS
export const insertRecoveryRequest = async (recoveryRequest: RecoveryRequest) => {
	const { error } = await supabase.from('recovery_requests').insert(recoveryRequest);
	if (error) throw new Error(error.message);
};
export const selectRecoveryRequest = async (id: string) => {
	const { data, error } = await supabase.from('recovery_requests').select().match({ id });
	if (error) throw new Error(error.message);
	if (!data || !data.length) throw new Error('Recover request not found!');
	return data[0] as RecoveryRequest;
};
export const selectRecoveryRequests = async ({ search }: { search?: string }) => {
	let query = supabase
		.from('recovery_requests')
		.select()
		.order('created_at', { ascending: false });
	if (search) query.ilike('email', `%${search}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	const recoveryRequests: RecoveryRequestData[] = [];
	await Promise.all(
		(data as RecoveryRequest[]).map(async (recoveryRequest) => {
			try {
				const account = await selectAccountByEmail(recoveryRequest.email);
				recoveryRequests.push({ account, recoveryRequest });
			} catch {}
		}),
	);
	return recoveryRequests;
};
export const deleteRecoveryRequest = async (id: string) => {
	const { error } = await supabase.from('recovery_requests').delete().match({ id });
	if (error) throw new Error(error.message);
};
