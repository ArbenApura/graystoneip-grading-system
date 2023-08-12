// IMPORTED TYPES
import type { Account } from '$types/credentials';
// IMPORTED LIB-UTILS
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
// IMPORTED UTILS
import { selectAccountByEmailAndPassword } from '$utils/supabase';
import { decrypt, encrypt } from '$utils/helpers';
// IMPORTED STATES
import { DEFAULT_ACCOUNT, authStates } from './states';
import { isInitialized } from '..';

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
	const account = get(authStates.account);
	const authHash = encrypt(account);
	localStorage.setItem('authHash', authHash);
};
export const loadData = async () => {
	if (typeof localStorage === 'undefined') return;
	const authHash = localStorage.getItem('authHash');
	if (!authHash) return;
	const { email, password } = decrypt(authHash) as Account;
	if (!email || !password) return;
	await login(email, password);
};
export const observeRoute = async () => {
	const isLogined = get(authStates.isLogined);
	const account = get(authStates.account);
	const { route } = get(page);
	if (!route || !route.id) return;
	else if (isLogined && route.id === '/') await goto('/app/dashboard');
	else if (!isLogined && route.id.match('/app/')) await goto('/');
	else if (
		account.account_type !== 'admin' &&
		route.id.match(/\/app\/(curriculum|master-list|admin-controls)\//g)
	)
		await goto('/app/dashboard');
};
export const initializeAuthStates = async () => {
	await loadData();
};
