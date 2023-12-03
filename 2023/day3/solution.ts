import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';
import { getSumOfValues } from '../utilities/get-sum';

type NPosition = [number, number];
interface NumberPositions {
	[key: number]: NPosition;
}
interface SymbolPositions {
	[key: string]: NPosition;
}
interface RowWithNumberAndSymbolPositions {
	[key: number]: [NumberPositions[], SymbolPositions[]];
}

const testString = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const testString2 = `.................=....836......402.755............=.......*.......*....181.62...*.....%........................596......*............#591...
...............764.....................................488.....880.209........416..................183...156..........917...................`;
const getNumbersAndSymbolsPositions = (inputRow: string): [NumberPositions[], SymbolPositions[]] => {
	const data: string[] = inputRow.split('');
	const numberPositions: NumberPositions[] = [];
	const symbolPositions: SymbolPositions[] = [];

	for (let i = 0; i < data.length; i++) {
		const element = data[i];

		if (Number(element)) {
			let number: string = element;
			const numberPosition: NPosition = [i, i];
			let j = i + 1;

			// WHAT THE ACTUAL FUCK, JAVASCRIPT ?????? Number(0)
			while (Number(data[j]) || data[j] == '0') {
				numberPosition[1] = j;
				number = number + data[j].toString(); //appending to nubmer string
				i = j; //skipping number that are already in
				j++; // now incrementing j for while loop
			}
			numberPositions.push({ [Number(number)]: numberPosition });
		}

		if (!Number(element) && element !== '.') {
			let symbol: string = element;
			const symbolPosition: NPosition = [i, i];
			let j = i + 1;
			while (!Number(data[j]) && data[j] !== '.') {
				//how to break out of while loop?
				if (j > data.length) break;
				symbolPosition[1] = j;
				symbol = symbol + data[j].toString(); //appending to nubmer string
				j++;
				i = j; //skipping number that are already in
			}
			symbolPositions.push({ [symbol]: symbolPosition });
		}
	}

	return [numberPositions, symbolPositions];
};

const helperFunctionSymbolVicinity = (symbolPositions: NPosition, currentNumPositions: NPosition) => {
	const isinFirstSymbolVicinity =
		symbolPositions[0] == currentNumPositions[0] ||
		symbolPositions[0] == currentNumPositions[0] - 1 ||
		symbolPositions[0] == currentNumPositions[0] + 1 ||
		symbolPositions[0] == currentNumPositions[1] ||
		symbolPositions[0] == currentNumPositions[1] - 1 ||
		symbolPositions[0] == currentNumPositions[1] + 1;
	const isinSecondSymbolVicinity =
		symbolPositions[1] == currentNumPositions[0] ||
		symbolPositions[1] == currentNumPositions[0] - 1 ||
		symbolPositions[1] == currentNumPositions[0] + 1 ||
		symbolPositions[1] == currentNumPositions[1] ||
		symbolPositions[1] == currentNumPositions[1] - 1 ||
		symbolPositions[1] == currentNumPositions[1] + 1;

	return isinFirstSymbolVicinity || isinSecondSymbolVicinity;
};

const returnSumOfNumbersAdjectendToSymbol = (inputString: string) => {
	const rows = getRows(inputString);
	const numbersToSum: number[] = [];
	const database: RowWithNumberAndSymbolPositions = {};
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		const [numbers, symbols] = getNumbersAndSymbolsPositions(row);
		database[i] = [numbers, symbols];
	}
	for (let y = 0; y < rows.length; y++) {
		const previousRow = database[y - 1];
		const currentRow = database[y];
		const nextRow = database[y + 1];

		if (currentRow[0].length === 0) continue; //no numbers in row
		for (let nums = 0; nums < currentRow[0].length; nums++) {
			const prevRowOk = previousRow === undefined || previousRow?.[1]?.length === 0 ? true : false;
			const thisRowOk = currentRow[1]?.length === 0 ? true : false;
			const nextRowOk = nextRow === undefined || nextRow?.[1]?.length === 0 ? true : false;

			const currentNum = Object.keys(currentRow[0][nums])[0];
			const currentNumPositions = currentRow[0][nums][currentNum as unknown as number];

			//happy path
			if (prevRowOk && thisRowOk && nextRowOk) numbersToSum.push(Number(currentNum));

			//validations
			if (!prevRowOk) {
				for (let syms = 0; syms < previousRow[1].length; syms++) {
					const symbol = Object.keys(previousRow[1][syms])[0];
					const symbolPositions = previousRow[1][syms][symbol as unknown as string];
					if (helperFunctionSymbolVicinity(symbolPositions, currentNumPositions)) {
						numbersToSum.push(Number(currentNum));
						continue;
					}
				}
			}
			if (!thisRowOk) {
				for (let syms = 0; syms < currentRow[1].length; syms++) {
					const symbol = Object.keys(currentRow[1][syms])[0];
					const symbolPositions = currentRow[1][syms][symbol as unknown as string];
					if (helperFunctionSymbolVicinity(symbolPositions, currentNumPositions)) {
						numbersToSum.push(Number(currentNum));
						continue;
					}
				}
			}
			if (!nextRowOk) {
				for (let syms = 0; syms < nextRow[1].length; syms++) {
					const symbol = Object.keys(nextRow[1][syms])[0];
					const symbolPositions = nextRow[1][syms][symbol as unknown as string];
					if (helperFunctionSymbolVicinity(symbolPositions, currentNumPositions)) {
						numbersToSum.push(Number(currentNum));
						continue;
					}
				}
			}
		}
	}
	return getSumOfValues(numbersToSum);
};

const runInputData = () => {
	const inputData = readInputFile('day3', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return returnSumOfNumbersAdjectendToSymbol(inputData);
};
console.log('Test Input: ' + returnSumOfNumbersAdjectendToSymbol(testString));
console.log('Real Input: ' + runInputData());
