import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';
import { getSumOfValues } from '../utilities/get-sum';

const LOG = false;
const testString_0 = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;
//example 1
//0   3   6   9  12  15  B-> 18
//  3   3   3   3   3  A-> 3
//    0   0   0   0 ->0

//example 2
//1   3   6  10  15  21 -> 28
//  2   3   4   5   6 -> 7
//    1   1   1   1 -> 1
//      0   0   0 -> 0

//example 3
//10  13  16  21  30  45 -> 68 -> 101
//   3   3   5   9  15 -> 23 -> 33
//     0   2   4   6 -> 8 -> 10
//       2   2   2 -> 2 -> 2
//         0   0 -> 0 -> 0
// výsledek 68+23+8+2+0 = 101 --> další číslo je 101
// výsledek 23+8+2 -> 33 --> další číslo je 33
// výsledek 8+2 -> 10 --> další číslo je 10
// výsledek 2 -> 2 --> další číslo je 2
// --> tzn že nemusím vědět od nejspodnějšího čísla, stačí mně vědět sloupec a mít na konci nulu

function findNextHistoryNumber(history: number[]): number {
	const map = new Map<number, number[]>();
	map.set(0, history);

	let counter = 0;
	let currentLine = map.get(counter)!;
	while (!currentLine?.every((x) => Number(x) == 0)) {
		const nextLine = [];
		for (let i = currentLine.length - 1; i > 0; i--) {
			nextLine.push(currentLine[i] - currentLine[i - 1]);
		}
		counter++;
		//reverse cause of previous forloop
		map.set(counter, nextLine.reverse());
		currentLine = nextLine;
	}

	const lastValueFromEveryLine = [history[history.length - 1]];
	for (let i = 1; i < map.size; i++) {
		const line = map.get(i)!;
		lastValueFromEveryLine.push(line[line.length - 1]);
	}
	if (LOG) console.log('🚀 ~ file: solution.ts:49 ~ findNextHistoryNumber ~ lastValueFromEveryLine:', lastValueFromEveryLine);
	//viz example 3 commentary
	return getSumOfValues(lastValueFromEveryLine);
}
function getSumOfHistoryExtrapolatedValues(input: string): number {
	const historyLines = getRows(input);
	const history = historyLines.map((line) => line.split(' ').map((x) => parseInt(x)));
	if (LOG) console.log('🚀 ~ file: solution.ts:32 ~ getSumOfHistoryExtrapolatedValues ~ history:', history);
	const nextHistoryNumbers = history.map((line) => findNextHistoryNumber(line));
	if (LOG) console.log('🚀 ~ file: solution.ts:49 ~ getSumOfHistoryExtrapolatedValues ~ nextHistoryNumbers:', nextHistoryNumbers);

	return getSumOfValues(nextHistoryNumbers);
}

const runTestInput = (input: string) => {
	const result = getSumOfHistoryExtrapolatedValues(input);
	return result;
};
const runRealInput = () => {
	const input = readInputFile('day9', 'input.txt');
	if (!input) throw new Error('No input data');
	const result = getSumOfHistoryExtrapolatedValues(input);
	return result;
};

console.log('Test Input: ' + runTestInput(testString_0));
console.log('Real Input: ' + runRealInput());

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
