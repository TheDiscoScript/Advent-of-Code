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
const testString_0_expanded = `....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......`;
/**
In these 9 galaxies, there are 36 pairs.
 Only count each pair once;
  order within the pair doesn't matter.
   For each pair, find any shortest path between 
   the two galaxies using only steps that 
   move up, down, left, or right exactly one . or # at a time. 
 */

const LOG = true;

function createGalaxy(input: string[]): string[][] {
	const map: string[][] = [];
	input.forEach((row) => {
		const newRow = row.split('');
		map.push(newRow);
	});
	return map;
}
function expandGalaxies(galaxy: string[][]): string[][] {
	//Horizontal
	for (let i = 0; i < galaxy.length; i++) {
		if (galaxy[i].every((el) => el === '.')) {
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
					for (let k = 0; k < galaxy.length; k++) {
						galaxy[k].splice(j, 0, '.');
					}
					//skip column because we just added a new one
					j++;
				}
			}
		}
	}

	return galaxy;
}

type GalaxyHighway = {
	origin: { row: number; index: number };
};

function findGalaxies(galaxy: string[][]): Map<number, GalaxyHighway> {
	const galaxyHighways = new Map<number, GalaxyHighway>();
	let galaxyCount = 0;
	for (let i = 0; i < galaxy.length; i++) {
		const row = galaxy[i];
		for (let j = 0; j < row.length; j++) {
			const el = row[j];
			if (el === '#') {
				const galaxyHighway: GalaxyHighway = {
					origin: {
						row: i,
						index: j,
					},
				};
				galaxyCount++;
				galaxyHighways.set(galaxyCount, galaxyHighway);
			}
		}
	}

	return galaxyHighways;
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
	const expandedGalaxy = expandGalaxies(galaxy);
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
console.log('Real Input: ' + runRealInput());

// 1
// 1-2, 1-3, 1-4, 1-5, 1-6, 1-7, 1-8, 1-9
// 2-3, 2-4, 2-5, 2-6, 2-7, 2-8, 2-9
// 3-4, 3-5, 3-6, 3-7, 3-8, 3-9
// 4-5, 4-6, 4-7, 4-8, 4-9
// 5-6, 5-7, 5-8, 5-9
// 6-7, 6-8, 6-9
// 7-8, 7-9
// 8-9
// 9
