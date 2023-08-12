// IMPORTED LIB-UTILS
import { v4 } from 'uuid';
import EmailValidator from 'email-validator';
import CryptoJS from 'crypto-js';

// UTILS
export const generateId = v4;
export const sleep = (timeout: number) => new Promise((res) => setTimeout(res, timeout));
export const formatDate = (date: Date) => {
	const year = date.getFullYear();
	let month = String(date.getMonth() + 1).padStart(2, '0');
	let day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
export const validateEmail = (email: string) => EmailValidator.validate(email);
export const encrypt = (data: any) =>
	CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_SECRET_KEY).toString();
export const decrypt = (data: string) => {
	const bytes = CryptoJS.AES.decrypt(data, import.meta.env.VITE_SECRET_KEY);
	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
