// IMPORTED LIB-UTILS
import { v4 } from 'uuid';
import EmailValidator from 'email-validator';
import CryptoJS from 'crypto-js';

// UTILS
export const generateId = v4;
export const sleep = (timeout: number) => new Promise((res) => setTimeout(res, timeout));
export const validateEmail = (email: string) => EmailValidator.validate(email);
export const encrypt = (data: any) =>
	CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_SECRET_KEY).toString();
export const decrypt = (data: string) => {
	const bytes = CryptoJS.AES.decrypt(data, import.meta.env.VITE_SECRET_KEY);
	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
export const numberToLetter = (number: number) => (number + 10).toString(36).toUpperCase();
