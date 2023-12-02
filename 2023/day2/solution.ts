import { posix } from 'path';
import { getRows } from '../utilities/get-rows';
import { readInputFile } from '../utilities/file-reader';

const colours = ['red', 'green', 'blue'];
const testQubes = {
	red: 12,
	green: 13,
	blue: 14,
};
const testString = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const parseRow = (row: string) => {
	let parsed: {
		[key: string]: {
			[keyC in 'red' | 'green' | 'blue']: number;
		};
	} = {};
	const [game, cubes] = row.split(':');
	const gameNumber = game.split(' ')[1];
	const gameSet = cubes.split(';');
	parsed[gameNumber] = {
		red: 0,
		green: 0,
		blue: 0,
	};

	for (let i = 0; i < gameSet.length; i++) {
		const gameSetItem = gameSet[i];
		const splitPairs = gameSetItem.split(',');
		for (let j = 0; j < splitPairs.length; j++) {
			const pair = splitPairs[j].trim().split(' ');
			const colour = pair[1] as 'red' | 'green' | 'blue';
			const number = parseInt(pair[0]);
			if (!parsed[gameNumber][colour]) parsed[gameNumber][colour] = number;
			else if (parsed[gameNumber][colour] < number) parsed[gameNumber][colour] = number;
			continue;
		}
	}
	return parsed;
};
const decidePossibility = (parsed: ReturnType<typeof parseRow>): boolean => {
	const parsedValues = Object.values(parsed)[0];
	for (let i = 0; i < colours.length; i++) {
		const colour = colours[i] as 'red' | 'green' | 'blue';
		if (parsedValues[colour] > testQubes[colour]) return false;
		continue;
	}
	return true;
};
const run = (input: string) => {
	const rows = getRows(input);
	const parsedRows = rows.map(parseRow);
	const possibilities = parsedRows.filter(decidePossibility);
	const sumOfIndexes = possibilities.reduce((acc, curr) => {
		const key = Object.keys(curr)[0];
		return acc + Number(key);
	}, 0);
	return sumOfIndexes;
};
const runInputData = () => {
	const inputData = readInputFile('day2', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return run(inputData);
};

console.log('Test Input: ' + run(testString));
console.log('Real Input: ' + runInputData());

const multiplyRowValues = (row: ReturnType<typeof parseRow>) => {
	const parsedValues = Object.values(row)[0];
	const sum = Object.values(parsedValues).reduce((acc, curr) => acc * curr, 1);
	return sum;
};
const runPart2 = (input: string) => {
	const rows = getRows(input);
	const parsedRows = rows.map(parseRow);
	const multipliedValues = parsedRows.map(multiplyRowValues);
	const sumOfIndexes = multipliedValues.reduce((acc, curr) => acc + curr, 0);
	return sumOfIndexes;
};
const runInputDataPart2 = () => {
	const inputData = readInputFile('day2', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return runPart2(inputData);
};

console.log('Test Input Part 2: ' + runPart2(testString));
console.log('Real Input Part 2: ' + runInputDataPart2());
