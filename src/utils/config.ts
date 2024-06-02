// IMPORTED UTILS
import { decrypt, encrypt } from './helpers';

// -- UTILS -- //]

export const getEstimatedSchoolYear = () => {
	const year = new Date().getFullYear();

	return year + '-' + (year + 1);
};

export const getDefaultFilter = () => {
	let defaultFilter = { semester: '1st', school_year: getEstimatedSchoolYear() };

	try {
		if (typeof localStorage === 'undefined') throw new Error();

		const encrypted = localStorage.getItem('config.defaultFilter');

		if (!encrypted) throw new Error();

		const decrypted = decrypt(encrypted);

		if (!decrypted) throw new Error();

		defaultFilter = JSON.parse(decrypted) as typeof defaultFilter;

		return defaultFilter;
	} catch {
		return defaultFilter;
	}
};

export const setDefaultFilter = (defaultFilter: { semester: string; school_year: string }) => {
	if (typeof localStorage === 'undefined') return;

	const data = JSON.stringify(defaultFilter);
	const encrypted = encrypt(data);

	localStorage.setItem('config.defaultFilter', encrypted);
};
