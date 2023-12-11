function factorialize(num: number): number {
	if (num < 0) return -1;
	else if (num == 0) return 1;
	else {
		return num * factorialize(num - 1);
	}
}
function numberOfPairCombination(galaxyCount: number): number {
	return (factorialize(galaxyCount) / factorialize(2)) * factorialize(galaxyCount - 2);
}
