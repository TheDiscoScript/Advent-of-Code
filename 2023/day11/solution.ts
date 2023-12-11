import { arrayOfArraysToString, arrayToString } from '../utilities/array-to-string';
import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';

// . = empty space
// # = galaxy
/**
Due to something involving gravitational effects,
only some space expands. In fact, the result is
that any rows or columns that contain no galaxies
   should all actually be twice as big.
 */
const testString_0 = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

/**
In these 9 galaxies, there are 36 pairs.
 Only count each pair once;
  order within the pair doesn't matter.
   For each pair, find any shortest path between 
   the two galaxies using only steps that 
   move up, down, left, or right exactly one . or # at a time. 
 */

const LOG = false;

function createGalaxy(input: string[]): string[][] {
	const map: string[][] = [];
	input.forEach((row) => {
		const newRow = row.split('');
		map.push(newRow);
	});
	return map;
}
function expandGalaxies(
	galaxy: string[][],
	spaceBetween?: number,
): { expandedGalaxy: string[][]; rememberHorizontal?: number[]; rememberVertical?: number[] } {
	//Horizontal
	const rememberHorizontal: number[] = [];
	const rememberVertical: number[] = [];
	for (let i = 0; i < galaxy.length; i++) {
		if (galaxy[i].every((el) => el === '.')) {
			if (spaceBetween) rememberVertical.push(i);

			galaxy.splice(i, 0, galaxy[i]);

			i++;
		}

		//check vertical column
		if (i === 0) {
			//row length - check each el in row
			for (let j = 0; j < galaxy[i].length; j++) {
				const column = [];
				//populate column
				for (let k = 0; k < galaxy.length; k++) {
					column.push(galaxy[k][j]);
				}
				//check column
				if (column.every((el) => el === '.')) {
					if (spaceBetween) rememberHorizontal.push(j);

					for (let k = 0; k < galaxy.length; k++) {
						galaxy[k].splice(j, 0, '.');
					}
					//skip column because we just added a new one
					j++;
				}
			}
		}
	}

	return { expandedGalaxy: galaxy, rememberHorizontal, rememberVertical };
}

type GalaxyHighway = {
	origin: { row: number; index: number };
};

function findGalaxies(galaxy: string[][], spaceBetween?: number, verticalPush?: number[], horizontalPush?: number[]): Map<number, GalaxyHighway> {
	const galaxyHighways = new Map<number, GalaxyHighway>();
	let galaxyCount = 0;
	for (let i = 0; i < galaxy.length; i++) {
		const row = galaxy[i];
		for (let j = 0; j < row.length; j++) {
			const el = row[j];
			if (el === '#') {
				const galaxyHighway: GalaxyHighway = {
					origin: {
						row: verticalPush && verticalPush?.length > 0 ? calculateVertical(i) : i,
						index: horizontalPush && horizontalPush.length > 0 ? calculateHorizontal(j) : j,
					},
				};
				galaxyCount++;
				galaxyHighways.set(galaxyCount, galaxyHighway);
			}
		}
	}

	return galaxyHighways;
	function calculateVertical(rowValue: number): number {
		let sum = rowValue;
		for (let i = 0; i < verticalPush!.length; i++) {
			if (verticalPush![i] < rowValue) {
				sum += spaceBetween! - 2;
			}
		}
		return sum;
	}
	function calculateHorizontal(indexValue: number): number {
		let sum = indexValue;
		for (let i = 0; i < horizontalPush!.length; i++) {
			if (horizontalPush![i] < indexValue) {
				sum += spaceBetween! - 2; // -2 because we added a new column ... FOR FUCK SAKE
			}
		}
		return sum;
	}
}
function createGalaxyHighwayMap(galaxy: Map<number, GalaxyHighway>): Map<string, { steps: number }> {
	const galaxyHighwayMap = new Map<string, { steps: number }>();
	for (let i = 1; i <= galaxy.size; i++) {
		for (let j = i + 1; j <= galaxy.size; j++) {
			const smaller = i < j ? i : j;
			const larger = i > j ? i : j;
			const key = `${smaller}-${larger}`;
			if (!galaxyHighwayMap.has(key)) {
				const galaxyAOrigin = galaxy.get(smaller)?.origin!;
				const galaxyBOrigin = galaxy.get(larger)?.origin!;
				galaxyHighwayMap.set(key, {
					steps: calculateNumberOfStepsBetweenGalaxies(
						{ row: galaxyAOrigin?.row, index: galaxyAOrigin?.index },
						{ row: galaxyBOrigin?.row, index: galaxyBOrigin?.index },
					),
				});
			}
		}
	}

	return galaxyHighwayMap;

	function calculateNumberOfStepsBetweenGalaxies(pointA: { row: number; index: number }, pointB: { row: number; index: number }): number {
		let steps = Math.abs(pointA.row - pointB.row) + Math.abs(pointA.index - pointB.index);
		return steps;
	}
}
const run = (input: string): number => {
	if (LOG) console.log('🚀s ~ file: solution.ts:57 ~ run ~ input:', `\n${input}`);
	const rows = getRows(input);
	const galaxy = createGalaxy(rows);
	const { expandedGalaxy } = expandGalaxies(galaxy);
	//	console.log('🚀 ~ file: solution.ts:72 ~ run ~ expandedGalaxy:', expandedGalaxy);
	if (LOG) console.log('🚀 ~ file: solution.ts:72 ~ run ~ expandedGalaxy:', `\n${arrayOfArraysToString(expandedGalaxy)}`);

	const foundGalaxies = findGalaxies(expandedGalaxy);
	if (LOG) console.log('🚀 ~ file: solution.ts:166 ~ run ~ foundGalaxies:', foundGalaxies);
	const galaxyHighwayMap = createGalaxyHighwayMap(foundGalaxies);
	if (LOG) console.log('🚀 ~ file: solution.ts:139 ~ run ~ galaxyHighwayMap:', galaxyHighwayMap);

	return sumOfAllPairsSteps(galaxyHighwayMap);
	function sumOfAllPairsSteps(galaxyHighwayMap: Map<string, { steps: number }>): number {
		let sum = 0;
		for (const [key, value] of galaxyHighwayMap) {
			sum += value.steps;
		}
		return sum;
	}
};
const runRealInput = (): number => {
	const input = readInputFile('day11', 'input.txt');
	if (!input) throw new Error('Input file not found.');
	return run(input);
};
console.log('Test Input: ' + run(testString_0));
//console.log('Real Input: ' + runRealInput());

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

const runPartTwo = (input: string, spaceBetween: number): number => {
	if (LOG) console.log('🚀s ~ file: solution.ts:57 ~ run ~ input:', `\n${input}`);
	const rows = getRows(input);
	if (LOG) console.log('Rows created');
	const galaxy = createGalaxy(rows);
	if (LOG) console.log('Galaxy created');
	const { expandedGalaxy, rememberHorizontal, rememberVertical } = expandGalaxies(galaxy, spaceBetween);
	if (LOG) console.log('🚀 ~ file: solution.ts:189 ~ runPartTwo ~ rememberVertical:', rememberVertical);
	if (LOG) console.log('🚀 ~ file: solution.ts:189 ~ runPartTwo ~ rememberHorizontal:', rememberHorizontal);
	if (LOG) console.log('Galaxy expanded');
	//	console.log('🚀 ~ file: solution.ts:72 ~ run ~ expandedGalaxy:', expandedGalaxy);
	if (LOG) console.log('🚀 ~ file: solution.ts:72 ~ run ~ expandedGalaxy:', `\n${arrayOfArraysToString(expandedGalaxy)}`);

	const foundGalaxies = findGalaxies(expandedGalaxy, spaceBetween, rememberVertical, rememberHorizontal);
	if (LOG) console.log('Galaxies found');
	if (LOG) console.log('🚀 ~ file: solution.ts:166 ~ run ~ foundGalaxies:', foundGalaxies);
	const galaxyHighwayMap = createGalaxyHighwayMap(foundGalaxies);
	if (LOG) console.log('Galaxy Highway Map created');
	if (LOG) console.log('🚀 ~ file: solution.ts:139 ~ run ~ galaxyHighwayMap:', galaxyHighwayMap);

	if (LOG) console.log('Counting');
	return sumOfAllPairsSteps(galaxyHighwayMap);
	function sumOfAllPairsSteps(galaxyHighwayMap: Map<string, { steps: number }>): number {
		let sum = 0;
		for (const [key, value] of galaxyHighwayMap) {
			sum += value.steps;
		}
		return sum;
	}
};

const runRealInputPartTwo = (): number => {
	const input = readInputFile('day11', 'input.txt');
	if (!input) throw new Error('Input file not found.');
	return runPartTwo(input, 1000000);
};
console.log('Test Input Part Two: ' + runPartTwo(testString_0, 100));
console.log('Real Input Part Two: ' + runRealInputPartTwo());
