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
const returnLinePoints = (line: string, isPartTwo?: boolean) => {
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

	if (isPartTwo) return winningNumbersCounter;
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
//////////////////
//////////////////

const weAreCountingCopiesOfCardNow = (input: { [key: string]: number }[]): number => {
	const cardsMap: Map<number, { original: number; copy: number }> = new Map<number, { original: 0; copy: 0 }>();

	//populate map, it is easier to work with it
	for (let i = 1; i <= input.length; i++) {
		cardsMap.set(i, { original: 1, copy: 0 });
	}

	for (let i = 0; i < input.length; i++) {
		const cardKey = Object.keys(input[i]);
		const cardValue = input[i][cardKey[0]];
		const cardInMap = cardsMap.get(i + 1);

		//I need to forLoop it twice - first time to increment original, second time to increment copy
		for (let x = 0; x < cardInMap!.original + cardInMap!.copy; x++) {
			for (let j = 1; j <= cardValue; j++) {
				const thisIsbitRetardedButI = i + 1;
				let cardInMapThatIsBeingIncremented = cardsMap.get(thisIsbitRetardedButI + j);
				if (!cardInMapThatIsBeingIncremented) continue;
				cardInMapThatIsBeingIncremented!.copy++;
			}
		}
	}

	let numOfScratchcardPoints = 0;
	cardsMap.forEach((value: { original: number; copy: number }) => {
		numOfScratchcardPoints += value.original + value.copy;
	});
	return numOfScratchcardPoints;
};

const returnSumOfPointsAllRowsPart2 = (input: string) => {
	const isPartTwo = true;
	const rows = getRows(input);
	const arrOfPoints = rows.map((row, index) => {
		const indexPlus1 = index + 1;
		const points = returnLinePoints(row, isPartTwo);
		return { [`${indexPlus1}`]: points };
	});

	const numberOfSctratchcards = weAreCountingCopiesOfCardNow(arrOfPoints);
	return numberOfSctratchcards;
};
const runInputDataPart2 = () => {
	const inputData = readInputFile('day4', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return returnSumOfPointsAllRowsPart2(inputData);
};
console.log('Test Input Part Two: ' + returnSumOfPointsAllRowsPart2(testString));
console.log('Real Input Part Two: ' + runInputDataPart2());
