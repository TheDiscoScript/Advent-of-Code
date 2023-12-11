export function arrayToString(array: string[]): string {
	let result = '';
	array.forEach((value) => {
		result += value + '\n';
	});
	return result;
}
export function arrayOfArraysToString(array: string[][]): string {
	let result = '';
	array.forEach((row) => {
		row.forEach((value) => {
			result += value;
		});
		result += '\n';
	});
	return result;
}
