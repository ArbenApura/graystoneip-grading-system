export const formatDate = (date: Date) => {
	const year = date.getFullYear();
	let month = String(date.getMonth() + 1).padStart(2, '0');
	let day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
