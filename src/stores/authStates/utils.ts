// IMPORTED LIB-UTILS
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
// IMPORTED UTILS
import { selectAccountByEmailAndPassword } from '$utils/supabase';
import { decrypt, encrypt } from '$utils/helpers';
// IMPORTED STATES
import { DEFAULT_ACCOUNT, authStates } from './states';

// UTILS
export const login = async (email: string, password: string) => {
	const account = await selectAccountByEmailAndPassword(email, password);
	authStates.account.set(account);
	authStates.isLogined.set(true);
	saveData();
	await observeRoute();
};
export const logout = async () => {
	authStates.account.set(DEFAULT_ACCOUNT);
	authStates.isLogined.set(false);
	saveData();
	await observeRoute();
};
export const saveData = () => {
	if (typeof localStorage === 'undefined') return;
	const encrypted = encrypt(
		JSON.stringify({
			account: get(authStates.account),
		}),
	);
	localStorage.setItem('authStates', encrypted);
};
export const loadData = async () => {
	try {
		if (typeof localStorage === 'undefined') return;
		const encrypted = localStorage.getItem('authStates');
		if (!encrypted) return;
		const decrypted = decrypt(encrypted);
		if (!decrypted) return;
		const { account } = JSON.parse(decrypted);
		if (!account) return;
		await login(account.email, account.password);
	} catch {
		await logout();
	}
};
export const handleRedirect = async () => {
	const account = get(authStates.account);
	const location =
		account.account_type === 'student'
			? '/app/grades?student_id=' + account.id
			: account.account_type === 'professor'
			? '/app/classes?professor_id=' + account.id
			: '/app/dashboard';
	await goto(location);
};
export const observeRoute = async () => {
	const isLogined = get(authStates.isLogined);
	const account = get(authStates.account);
	const { route } = get(page);
	if (!route || !route.id) return;
	if (isLogined && route.id === '/') await handleRedirect();
	if (!isLogined && route.id.match('/app/')) await goto('/');
	if (
		account.account_type !== 'admin' &&
		route.id.match(/\/app\/(curriculum|master-list|admin-controls)\//g)
	)
		await handleRedirect();
	if (account.account_type === 'professor' && route.id?.match(/\/app\/(dashboard|grades)/g))
		await handleRedirect();
	if (account.account_type === 'student' && route.id?.match(/\/app\/(dashboard|classes)/g))
		await handleRedirect();
};
export const initializeAuthStates = async () => {
	await loadData();
};
