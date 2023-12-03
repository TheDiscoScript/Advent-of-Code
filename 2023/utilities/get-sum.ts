export const getSumOfValues = (values: number[]): number => {
	return values.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);
};
