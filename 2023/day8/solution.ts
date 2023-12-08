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

function runTestData(input: string) {
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
	const fs = require('fs');
	const input = fs.readFileSync('./2023/day8/input.txt', 'utf8');
	return runTestData(input);
}
console.log('Test Input: ' + runTestData(testString_0));
console.log('Test Input 2: ' + runTestData(testString_1));
console.log('Real Input: ' + runInputData());
