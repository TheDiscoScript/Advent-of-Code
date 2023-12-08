import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';

const testString_0 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const testString_1 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const LOG = false;

function getNumberOfSteps(input: string) {
	let position = 'AAA';
	let stepsCounter = 0;
	let instructionCounter = 0;

	const rows = getRows(input);
	const instructions = rows[0];
	if (LOG) console.log('🚀 ~ file: solution.ts:22 ~ instructions:', instructions);
	const positionAndCoordinates = rows.slice(2);
	if (LOG) console.log('🚀 ~ file: solution.ts:24 ~ rules:', positionAndCoordinates);
	const positionMap = new Map<string, { left: string; right: string }>();

	for (const line of positionAndCoordinates) {
		const [position, nextCoordinates] = line.split(' = (');
		const [left, right] = nextCoordinates.split(', ').map((x) => x.replace(')', ''));
		positionMap.set(position, {
			left: left,
			right: right,
		});
	}
	if (LOG) console.log('🚀 ~ file: solution.ts:27 ~ positionMap:', positionMap);
	while (position !== 'ZZZ') {
		if (instructionCounter >= instructions.length) instructionCounter = 0;
		const command = instructions.charAt(instructionCounter);
		if (command === 'L') {
			position = positionMap.get(position)!.left;
		} else if (command === 'R') {
			position = positionMap.get(position)!.right;
		}
		stepsCounter++;
		instructionCounter++;
	}

	return stepsCounter;
}
function runInputData() {
	const input = readInputFile('day8', 'input.txt');
	if (!input) throw new Error('No input data');
	return getNumberOfSteps(input);
}
//console.log('Test Input: ' + getNumberOfSteps(testString_0));
//console.log('Test Input 2: ' + getNumberOfSteps(testString_1));
//console.log('Real Input: ' + runInputData());

// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
const testStringPartTwo = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

function returnCountOfSteps(input: string) {
	//prepare
	const rows = getRows(input);
	const instructions = rows[0];
	if (LOG) console.log('🚀 ~ file: solution.ts:22 ~ instructions:', instructions);
	const positionAndCoordinates = rows.slice(2);
	if (LOG) console.log('🚀 ~ file: solution.ts:24 ~ rules:', positionAndCoordinates);

	//map
	const positionMap = new Map<string, { left: string; right: string }>();
	for (const line of positionAndCoordinates) {
		const [position, nextCoordinates] = line.split(' = (');
		const [left, right] = nextCoordinates.split(', ').map((x) => x.replace(')', ''));
		positionMap.set(position, {
			left: left,
			right: right,
		});
	}
	if (LOG) console.log('🚀 ~ file: solution.ts:88 ~ run ~ positionMap:', positionMap);

	//keys for start/end positions
	const mapStarterKeys = Array.from(positionMap.keys()).filter((x) => x.endsWith('A'));
	const mapStarterMap = new Map<string, { current: string }>();
	for (const key of mapStarterKeys) {
		mapStarterMap.set(key, {
			current: key,
		});
	}
	if (LOG) console.log('🚀 ~ file: solution.ts:97 ~ run ~ mapStarterKeys:', mapStarterKeys);
	if (LOG) console.log('🚀 ~ file: solution.ts:101 ~ run ~ mapStarterMap:', mapStarterMap);

	let stepsCounter = 0;
	let instructionCounter = 0;
	let allStartersOnZ = false;
	console.time('run');
	while (!allStartersOnZ) {
		if (instructionCounter >= instructions.length) instructionCounter = 0;
		const command = instructions.charAt(instructionCounter);
		if (command === 'L') {
			for (const [key, value] of mapStarterMap) {
				const newPosition = positionMap.get(value.current)!.left;
				value.current = newPosition;
			}
		} else if (command === 'R') {
			for (const [key, value] of mapStarterMap) {
				const newPosition = positionMap.get(value.current)!.right;
				value.current = newPosition;
			}
		}
		stepsCounter++;
		if (LOG) console.log('🚀 ~ file: solution.ts:128 ~ run ~ stepsCounter:', stepsCounter);
		if (LOG) console.log('🚀 ~ file: solution.ts:129 ~ run ~ mapStarterMap:', mapStarterMap);
		instructionCounter++;
		allStartersOnZ = Array.from(mapStarterMap.values()).every((x) => x.current.endsWith('Z'));
		console.log('Number of steps: ' + stepsCounter);
	}
	console.timeEnd('run');
	return stepsCounter;
}

function runInputDataPartTwo() {
	const input = readInputFile('day8', 'input.txt');
	if (!input) throw new Error('No input data');
	return returnCountOfSteps(input);
}
//console.log('Test Input Part Two: ' + returnCountOfSteps(testStringPartTwo));
//console.log('Real Input Part Two: ' + runInputDataPartTwo());

//Greatest Common Divisor
function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b);
}

//Least Common Multiple
function lcm(a: number, b: number): number {
	return (a * b) / gcd(a, b);
}

console.log('lcm: ' + lcm(21883, 13019));
console.log('lcm2: ' + lcm(1028501, 19667));
console.log('lcm3: ' + lcm(73023571, 16343));
console.log('lcm4: ' + lcm(4308390689, 18559));
console.log('lcm5: ' + lcm(288662176163, 14681));

function calculateCycleLengthForStarter(starter: string, positionMap: Map<string, { left: string; right: string }>, instructions: string): number {
	let position = starter;
	let stepsCounter = 0;
	let instructionCounter = 0;
	let endsOnZ = false;
	while (!endsOnZ) {
		if (instructionCounter >= instructions.length) instructionCounter = 0;
		const command = instructions.charAt(instructionCounter);
		if (command === 'L') {
			position = positionMap.get(position)!.left;
		} else if (command === 'R') {
			position = positionMap.get(position)!.right;
		}
		stepsCounter++;
		instructionCounter++;
		endsOnZ = position.endsWith('Z');
	}
	return stepsCounter;
}

function returnCountOfStepsOptimized(input: string) {
	console.time('run');
	//prepare
	const rows = getRows(input);
	const instructions = rows[0];
	if (LOG) console.log('🚀 ~ file: solution.ts:22 ~ instructions:', instructions);
	const positionAndCoordinates = rows.slice(2);
	if (LOG) console.log('🚀 ~ file: solution.ts:24 ~ rules:', positionAndCoordinates);

	//map
	const positionMap = new Map<string, { left: string; right: string }>();
	for (const line of positionAndCoordinates) {
		const [position, nextCoordinates] = line.split(' = (');
		const [left, right] = nextCoordinates.split(', ').map((x) => x.replace(')', ''));
		positionMap.set(position, {
			left: left,
			right: right,
		});
	}
	if (LOG) console.log('🚀 ~ file: solution.ts:88 ~ run ~ positionMap:', positionMap);

	//keys for start/end positions
	const mapStarterKeys = Array.from(positionMap.keys()).filter((x) => x.endsWith('A'));
	const mapStarterMap = new Map<string, { current: string; cycleLength: number }>();
	for (const key of mapStarterKeys) {
		mapStarterMap.set(key, {
			current: key,
			cycleLength: calculateCycleLengthForStarter(key, positionMap, instructions),
		});
	}
	if (LOG) console.log('🚀 ~ file: solution.ts:97 ~ run ~ mapStarterKeys:', mapStarterKeys);
	if (LOG) console.log('🚀 ~ file: solution.ts:101 ~ run ~ mapStarterMap:', mapStarterMap);

	const allCycleLengths = Array.from(mapStarterMap.values()).map((x) => x.cycleLength);
	if (LOG) console.log('🚀 ~ file: solution.ts:210 ~ returnCountOfStepsOptimized ~ allCycleLengths:', allCycleLengths);
	const stepsToLeastCommonMultiple = allCycleLengths.reduce((acc, curr) => lcm(acc, curr), 1);
	if (LOG) console.log('🚀 ~ file: solution.ts:212 ~ returnCountOfStepsOptimized ~ stepsToLeastCommonMultiple:', stepsToLeastCommonMultiple);

	console.timeEnd('run');
	return stepsToLeastCommonMultiple;
}
function runInputDataPartTwoOptimized() {
	const input = readInputFile('day8', 'input.txt');
	if (!input) throw new Error('No input data');
	return returnCountOfStepsOptimized(input);
}
console.log('Test Input Part Two Optimized: ' + returnCountOfStepsOptimized(testStringPartTwo));
console.log('Real Input Part Two Optimized: ' + runInputDataPartTwoOptimized());
