export function mapToString(map: Map<number, string[]>): string {
	let result = '';
	map.forEach((value, key) => {
		result += value.join('') + '\n';
	});
	return result;
}
