import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';

/**
 | is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
 */
const testString_0_Simple = `.....
.S-7.
.|.|.
.L-J.
.....`;
const testString_0_Complex = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;
const testString_1_Simple = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;
const testString_1_Complex = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

//TODO
//function to find Start
//function to decide if it is possible to go from one point to another
//array to get path coordinates for each step
const LOG = false;

function createMazeMap(input: string): { startCoordinates: { row: number; index: number }; map: Map<number, string[]> } {
	const rows = getRows(input);
	const startCoordinates = { row: 0, index: 0 };
	const map = new Map<number, string[]>();
	for (let i = 0; i < rows.length; i++) {
		if (rows[i].includes('S')) {
			startCoordinates.row = i;
			startCoordinates.index = rows[i].indexOf('S');
		}
		map.set(i, rows[i].split(''));
	}
	return { map, startCoordinates };
}

type Surroundings = { north: string | undefined; south: string | undefined; east: string | undefined; west: string | undefined };
type Direction = 'north' | 'south' | 'east' | 'west';
function checkEligibilityOfPath(currentLetter: string, surroundings: Surroundings): Direction {
	const { north, south, east, west } = surroundings;
	//this could be optimized, cause with some of letters we already know the next coordinate
	//we will just pick first route, it doesnt matter
	if (currentLetter === 'S') {
		if (north === '|' || north === '7' || north === 'F') return 'north';
		if (south === '|' || south === 'J' || south === 'L') return 'south';
		if (east === '-' || east === 'J' || east === '7') return 'east';
		if (west === '-' || west === 'L' || west === 'F') return 'west';
	}

	if (currentLetter === '|') {
		if (north === 'S' || north === '|' || north === '7' || north === 'F') return 'north';
		if (south === 'S' || south === '|' || south === 'J' || south === 'L') return 'south';
	}

	if (currentLetter === '-') {
		if (east === 'S' || east === '-' || east === 'J' || east === '7') return 'east';
		if (west === 'S' || west === '-' || west === 'L' || west === 'F') return 'west';
	}

	if (currentLetter === 'L') {
		if (north === 'S' || north === '|' || north === '7' || north === 'F') return 'north';
		if (east === 'S' || east === '-' || east === 'J' || east === '7') return 'east';
	}

	if (currentLetter === 'J') {
		if (north === 'S' || north === '|' || north === '7' || north === 'F') return 'north';
		if (west === 'S' || west === '-' || west === 'L' || west === 'F') return 'west';
	}

	if (currentLetter === '7') {
		if (south === 'S' || south === '|' || south === 'J' || south === 'L') return 'south';
		if (west === 'S' || west === '-' || west === 'L' || west === 'F') return 'west';
	}

	if (currentLetter === 'F') {
		if (south === 'S' || south === '|' || south === 'J' || south === 'L') return 'south';
		if (east === 'S' || east === '-' || east === 'J' || east === '7') return 'east';
	}

	return 'north'; //North is always watching
}
function getPositionFromDirection(direction: Direction, currentCoordinates: { row: number; index: number }) {
	const { row, index } = currentCoordinates;
	if (direction === 'north') return { row: row - 1, index };
	if (direction === 'south') return { row: row + 1, index };
	if (direction === 'east') return { row, index: index + 1 };
	if (direction === 'west') return { row, index: index - 1 };
}
function getBannedDirection(direction: Direction): Direction {
	if (direction === 'north') return 'south';
	if (direction === 'south') return 'north';
	if (direction === 'east') return 'west';
	if (direction === 'west') return 'east';

	throw new Error(`Invalid direction: ${direction}`);
}
function getExploredPath(startCoordinates: { row: number; index: number }, map: Map<number, string[]>) {
	const exploredPath = [`${startCoordinates.row}-${startCoordinates.index}`];

	let currentLetter = map.get(startCoordinates.row)![startCoordinates.index];
	let currentCoordinates = startCoordinates;
	let bannedDirection: Direction;
	while (currentLetter !== 'S' || (currentLetter === 'S' && exploredPath.length === 1)) {
		const surroundings: Surroundings = {
			north: bannedDirection! === 'north' ? undefined : map.get(currentCoordinates.row - 1)?.[currentCoordinates.index],
			south: bannedDirection! === 'south' ? undefined : map.get(currentCoordinates.row + 1)?.[currentCoordinates.index],
			east: bannedDirection! === 'east' ? undefined : map.get(currentCoordinates.row)?.[currentCoordinates.index + 1],
			west: bannedDirection! === 'west' ? undefined : map.get(currentCoordinates.row)?.[currentCoordinates.index - 1],
		};
		const direction = checkEligibilityOfPath(currentLetter, surroundings);
		bannedDirection = getBannedDirection(direction);
		if (LOG) console.log('------------------------------');
		if (LOG) console.log('🚀 ~ file: solution.ts:112 ~ getExploredPath ~ currentLetter:', currentLetter);
		if (LOG) console.log('🚀 ~ file: solution.ts:112 ~ getExploredPath ~ currentCoordinates:', currentCoordinates);
		if (LOG) console.log('🚀 ~ file: solution.ts:112 ~ getExploredPath ~ exploredPath:', exploredPath);
		if (LOG) console.log('🚀 ~ file: solution.ts:133 ~ getExploredPath ~ surroundings:', surroundings);
		if (LOG) console.log('🚀 ~ file: solution.ts:128 ~ getExploredPath ~ direction:', direction);
		if (LOG) console.log('🚀 ~ file: solution.ts:136 ~ getExploredPath ~ bannedDirection:', bannedDirection);
		if (LOG) console.log('------------------------------');
		currentCoordinates = getPositionFromDirection(direction, currentCoordinates)!;
		currentLetter = map.get(currentCoordinates.row)![currentCoordinates.index];
		exploredPath.push(`${currentCoordinates.row}-${currentCoordinates.index}`);
	}

	return exploredPath;
}

const run = (input: string) => {
	const { startCoordinates, map } = createMazeMap(input);
	if (LOG) console.log('🚀 ~ file: solution.ts:54 ~ run ~ map:', map);
	if (LOG) console.log('🚀 ~ file: solution.ts:54 ~ run ~ startCoordinates:', startCoordinates);
	const exploredPath = getExploredPath(startCoordinates, map);
	console.log('🚀 ~ file: solution.ts:129 ~ run ~ finalExploredPath:', exploredPath);
	return getStepsToFarthestPoint(exploredPath.length);

	function getStepsToFarthestPoint(exploredPathLength: number) {
		//start and finish is the same
		const pathWithoutFinish = exploredPathLength - 1;
		const stepsToFarthestPoint = pathWithoutFinish / 2;
		return stepsToFarthestPoint;
	}
};
const runRealInput = () => {
	const input = readInputFile('day10', 'input.txt');
	if (!input) throw new Error('No input data');
	return run(input);
};
console.log('Test Input 0: ' + run(testString_0_Simple));
console.log('Test Input 0_Complex: ' + run(testString_0_Complex));
console.log('Test Input 1: ' + run(testString_1_Simple));
console.log('Test Input 1_Complex: ' + run(testString_1_Complex));
console.log('Real Input: ' + runRealInput());

////////////////////////////////////////////////
////////////////////////////////////////////////

const testStringPartTwo_0 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;
const testStringPartTwo_1 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;
