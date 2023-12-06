import { readInputFile } from '../utilities/file-reader';

// 0 *7 = 0
// 1 *6 = 6 < 9
// 2 *5 = 10 > 9
// 3 *4 = 12

// 4 *3 = 12
// 5 *2 = 10
// 6 *1 = 6
// 7 *0 = 0

type Race = { raceTime: number; recordDistance: number; numberOfWaysToBeatRecord: number };

const testString = `Time:      7  15   30
Distance:  9  40  200`;

// (-x^2)+7x>9
// (-x^2)+15x>40

// (-x^2)+30x>200

// -xNaDruhou + čas*x > rekord
function calcul(time: number, record: number, num: number) {
	return -(num * num) + time * num > record;
}
//console.log(calcul(7, 9));

const calculateNumberOfWaysToBeatRecord = (raceTime: number, recordDistance: number): number => {
	let numberOfWaysToBeatRecord = 0;

	//loop throug miliseconds
	for (let i = 1; i < raceTime; i++) {
		let remainingTime = raceTime - i;
		if (remainingTime === 0) continue;

		if (i * remainingTime > recordDistance) {
			numberOfWaysToBeatRecord++;
		}
	}
	return numberOfWaysToBeatRecord;
};
const calculateNumOfMultipliedNumbersOfRecordsBreaking = (races: Race[]) => {
	return races.map((e) => (e.numberOfWaysToBeatRecord !== 0 ? e.numberOfWaysToBeatRecord : 1)).reduce((a, b) => a * b);
};
const optimizedCalculate = (race: Race) => {
	let numberOfWaysToBeatRecord = 0;
	for (let a = 0; a < race.raceTime; a++) {
		let remainingTime = race.raceTime - a;
		if (remainingTime === 0 || remainingTime === race.raceTime) continue;
		const currentDistance = a * remainingTime;
		if (currentDistance > race.recordDistance) {
			const halfLength = race.raceTime / 2;
			let position = a;
			if (halfLength > position) {
				const dif = (halfLength - position) * 2;
				numberOfWaysToBeatRecord = dif;
			}
			if (halfLength < position) {
				const dif = (position - halfLength) * 2;
				numberOfWaysToBeatRecord = dif;
			}
			continue;
		}
	}
	return numberOfWaysToBeatRecord + 1;
};
const optimizedCalculate2 = (race: Race) => {
	let numberOfWaysToBeatRecord = 0;
	for (let a = 0; a < race.raceTime; a++) {
		if (calcul(race.raceTime, race.recordDistance, a)) numberOfWaysToBeatRecord++;
	}
	return numberOfWaysToBeatRecord;
};
// Function to parse the input string
function parseInput(input: string, optimized?: boolean): Race[] {
	const lines = input.split('\n');
	const times = lines[0].split(':').pop()!.trim().split(/\s+/).map(Number);
	const distances = lines[1].split(':').pop()!.trim().split(/\s+/).map(Number);

	return times.map((time, index) => {
		return {
			raceTime: time,
			recordDistance: distances[index],
			numberOfWaysToBeatRecord: !optimized
				? calculateNumberOfWaysToBeatRecord(time, distances[index])
				: optimizedCalculate2({ raceTime: time, recordDistance: distances[index], numberOfWaysToBeatRecord: 0 }),
		};
	});
}

const runTestInputData = (input: string, optimized?: boolean) => {
	const parsedData = parseInput(input, optimized);
	console.log('🚀 ~ file: solution.ts:75 ~ runTestInputData ~ parsedData:', parsedData);
	return calculateNumOfMultipliedNumbersOfRecordsBreaking(parsedData);
};
const runInputData = (optimized?: boolean) => {
	const input = readInputFile('day6', 'input.txt');
	if (!input) throw new Error('Input file not found');
	const parsedData = parseInput(input, true);
	return calculateNumOfMultipliedNumbersOfRecordsBreaking(parsedData);
};
console.log('Test Input: ' + runTestInputData(testString));
console.time('runInputData');
console.log('Real Input: ' + runInputData());
console.timeEnd('runInputData');
console.log('Test Input optimized: ' + runTestInputData(testString, true));
console.time('runInputData optimized');
console.log('Real Input optimized: ' + runInputData(true));
console.timeEnd('runInputData optimized');

// Function to parse the input string
function parseInputPartTwo(input: string, unoptimized?: boolean): Race {
	const lines = input.split('\n');
	const time = Number(lines[0].split(':').pop()!.trim().replace(/\s+/g, ''));
	const distance = Number(lines[1].split(':').pop()!.trim().replace(/\s+/g, ''));

	return {
		raceTime: time,
		recordDistance: distance,
		numberOfWaysToBeatRecord: unoptimized
			? calculateNumberOfWaysToBeatRecord(time, distance)
			: optimizedCalculate2({ raceTime: time, recordDistance: distance, numberOfWaysToBeatRecord: 0 }),
	};
}
const runInputData2 = (unoptimized?: boolean) => {
	const input = readInputFile('day6', 'input.txt');
	if (!input) throw new Error('Input file not found');
	const parsedData = parseInputPartTwo(input, unoptimized);
	console.log('🚀 ~ file: solution.ts:130 ~ runInputData2 ~ parsedData:', parsedData);

	return parsedData.numberOfWaysToBeatRecord;
};

console.time('runInputData2 optimized');
console.log('Real Input part two: ' + runInputData2());
console.timeEnd('runInputData2 optimized');
console.time('runInputData2 not optimized');
console.log('Real Input part two not optimized: ' + runInputData2(true));
console.timeEnd('runInputData2 not optimized');
