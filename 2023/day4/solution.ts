import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';
import { getSumOfValues } from '../utilities/get-sum';

type WinningMap = Map<number, boolean[]>;

const testString = `Card 1: 41 48 83 86 17 | 83 86 6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const testLine = `Card 3: 21  1  2 59 44 | 69 82 63 72 16 21 14  1`;

//parse one line
// split on :, then split on |, then split on space
const returnLinePoints = (line: string) => {
	const [card, numbers] = line.split(': ');
	const [number1string, numbers2string] = numbers.split(' | ');
	const cardNumber = Number(card.split(' ')[1]);
	const winningNumbersMap: WinningMap = new Map<number, boolean[]>();
	number1string
		.trim()
		.split(' ')
		.forEach((number) => {
			const numberAsNumber = Number(number);
			if (!winningNumbersMap.has(numberAsNumber)) {
				winningNumbersMap.set(numberAsNumber, [false]);
			}
		});
	const numbers2Pile = numbers2string.split(' ').map(Number);

	for (let i = 0; i < numbers2Pile.length; i++) {
		const number = numbers2Pile[i];
		if (winningNumbersMap.has(number)) {
			winningNumbersMap.set(number, [true]);
		}
	}
	// 0 because of " " space in single digit numbers
	if (winningNumbersMap.has(0)) winningNumbersMap.delete(0);

	let winningNumbersCounter = 0;
	winningNumbersMap.forEach((value) => {
		if (value[0]) winningNumbersCounter++;
	});

	return calculatePoints(winningNumbersCounter);
};
const calculatePoints = (numberOfWinningNumbers: number) => {
	if (numberOfWinningNumbers === 0) return 0;
	let points = 1;
	if (numberOfWinningNumbers === 1) return points;
	for (let i = 2; i <= numberOfWinningNumbers; i++) {
		points = points * 2;
	}
	return points;
};

console.log(returnLinePoints(testLine));
//////////////////
const returnSumOfPointsAllRows = (input: string) => {
	const rows = getRows(input);
	const arrOfPoints = rows.map((row) => returnLinePoints(row));
	return getSumOfValues(arrOfPoints);
};
const runInputData = () => {
	const inputData = readInputFile('day4', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return returnSumOfPointsAllRows(inputData);
};

console.log('Test Input: ' + returnSumOfPointsAllRows(testString));
console.log('Real Input: ' + runInputData());
