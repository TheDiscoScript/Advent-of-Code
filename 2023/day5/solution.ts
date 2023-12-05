import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';

//helper showcase
// seeds: 79
// seed-to-soil map:	//=>81 soil
// 50 98 2   //50-51=>98-99
// 52 50 48  //52-99=>50-97  ==> 79 in this range === 79-50=29 --> 52+29=81!

// soil-to-fertilizer map:  //=> 81 fertilizer - is not in map
// 0 15 37   //0-37=>15-51
// 37 52 2   //37-38=>52-53
// 39 0 15   //39-53=>0->14

// fertilizer-to-water map: //=> 81 water - is not in map
// 49 53 8   //49-56=>53-60
// 0 11 42	  //0-41=>11->52
// 42 0 7    //42-48=>0-6
// 57 7 4    //57-60=>7-10

// water-to-light map: //=> 74 light
// 88 18 7   //88-94=>18-24
// 18 25 70  //18-87=>25-94 //=> 81 is in this range === 81-25=56 --> 18+56=74!

// light-to-temperature map: //=> 78 temperature
// 45 77 23  //45-67=>77-99
// 81 45 19  //81-99=>45-63
// 68 64 13  //68-80=>64-76  //=> 74 in this range === 74-64=10 --> 68+10=78!

// temperature-to-humidity map: //=> 78 humidity
// 0 69 1   //0=>69
// 1 0 69   //1-68=>0-68

// humidity-to-location map: //=> 82 location
// 60 56 37 //60-96=>56-92  //=> 78 is in this range === 78-56=22 --> 60+22=82!
// 56 93 4  //56-59=>93-96

// Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
type NameOfMap = string;
type UnalteredSeedValue = number;

interface XtoYMapWithSeedCalculations {
	seedCalculationMap: Map<UnalteredSeedValue, seedToCalculationMap>;
	processMaps: XtoYMap[];
}
interface XtoYMap {
	destinationRangeStart: number;
	sourceRangeStart: number;
	rangeLength: number;
	ranges: {
		destination: [number, number];
		source: [number, number];
	};
	//	seedCalculationMap: Map<UnalteredSeedValue, seedToCalculationMap>;
}
interface seedToCalculationMap {
	passedValueOfSeed: number;
}
type seedCalculationRange = [number, number];

const testString = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const LOG = true;
//const calculateCurrentMapValue = (alteredSeedValue: number, map: Omit<XtoYMap, 'seedCalculationMap'>) => {};
const calculateRange = (destination: number, source: number, range: number): { destination: [number, number]; source: [number, number] } => {
	const destinationArr: [number, number] = [destination, destination + range - 1];
	const sourceArr: [number, number] = [source, source + range - 1];
	return {
		destination: destinationArr,
		source: sourceArr,
	};
};
const calculateSeedValue = (seed: number, currentProcessedMaps: XtoYMap[]): number => {
	let result = seed;
	for (let map of currentProcessedMaps) {
		const { ranges } = map;
		const { destination, source } = ranges;
		const isSeedBetweenSourceInterval = seed >= source[0] && seed <= source[1];
		if (isSeedBetweenSourceInterval) {
			const sourceStartMinusSeed = seed - source[0];
			const destinationStartPlusSeed = destination[0] + sourceStartMinusSeed;
			result = destinationStartPlusSeed;
			if (LOG) console.log('🚀 ~ file: solution.ts:114 ~ calculateSeedValue ~ result:', result);
			return result;
		}
		continue;
	}
	return result!;
};

const createSeedToEverythingMap = (input: string) => {
	const rows = getRows(input);
	if (LOG) console.log('🚀 ~ file: solution.ts:75 ~ createSeedToEverythingMap ~ rows:', rows);
	const originalSeedValues = rows[0]
		.split(' ')
		.map(Number)
		.filter((num) => !isNaN(num));
	if (LOG) console.log('🚀 ~ file: solution.ts:76 ~ createSeedToEverythingMap ~ seeds:', originalSeedValues);

	const firstMapPosition = 2; //hack
	const theWholeProcessMap = new Map<NameOfMap, XtoYMapWithSeedCalculations>();

	//lil helpers
	let willBeMapNameRow = true;
	let previousMapName; //for easier access to previous map
	let currentMapName; //we will always get name from input.txt
	for (let i = firstMapPosition; i < rows.length; i++) {
		const row = rows[i];
		if (LOG) console.log('🚀 ~ file: solution.ts:99 ~ createSeedToEverythingMap ~ row:', row);

		//mapNameCheck
		if (willBeMapNameRow) {
			currentMapName = row.split(' ')[0];
			if (LOG) console.log('🚀 ~ file: solution.ts:105 ~ createSeedToEverythingMap ~ currentMapName:', currentMapName);
			theWholeProcessMap.set(currentMapName, { seedCalculationMap: new Map<UnalteredSeedValue, seedToCalculationMap>(), processMaps: [] });
			willBeMapNameRow = false;
			continue;
		}

		//emptyRowCheck / last row check --> so we can calculate values for seed now
		if (row === '' || i === rows.length - 1) {
			willBeMapNameRow = true;
			//lets calculate values for seed, when we are here.
			for (let originalSeed of originalSeedValues) {
				if (LOG)
					console.log('Original seed is ', originalSeed, ' and we are in map ', currentMapName, ' and previous map is ', previousMapName);
				let currentSeedValue = previousMapName
					? theWholeProcessMap.get(previousMapName)?.seedCalculationMap.get(originalSeed)?.passedValueOfSeed
					: originalSeed;

				if (LOG) console.log('🚀 ~ file: solution.ts:162 ~ createSeedToEverythingMap ~ currentSeedValue:', currentSeedValue);
				const currentProcessedMaps = theWholeProcessMap.get(currentMapName as string)!.processMaps;
				theWholeProcessMap.get(currentMapName as string)!.seedCalculationMap.set(originalSeed, {
					passedValueOfSeed: calculateSeedValue(currentSeedValue!, currentProcessedMaps),
				});
			}

			previousMapName = currentMapName;
			continue;
		}

		//destination[0], source[1], range[2]
		const [destination, source, range] = row.split(' ').map(Number);
		if (LOG) console.log('🚀 ~ file: solution.ts:122 ~ theWholeProcessMap.get ~ currentMapName:', currentMapName);
		theWholeProcessMap.get(currentMapName as string)?.processMaps.push({
			destinationRangeStart: destination,
			sourceRangeStart: source,
			rangeLength: range,
			ranges: calculateRange(destination, source, range),
		});

		//
	}
	//console.log('🚀 ~ file: solution.ts:96 ~ createSeedToEverythingMap ~ theWholeProcessMap:', theWholeProcessMap);
	if (LOG) console.dir(theWholeProcessMap, { depth: null });

	//i want to return last map in theWholeProcessMap
	return theWholeProcessMap.get(currentMapName as string)?.seedCalculationMap;
};

const calculateLowestLocationValue = (input: Map<UnalteredSeedValue, seedToCalculationMap>): number => {
	const values = Array.from(input.values());
	const lowestValue = Math.min(...values.map((value) => value.passedValueOfSeed));
	return lowestValue;
};

const runTestInputData = (input: string) => {
	const locationMap = createSeedToEverythingMap(input);
	const lowestLocationValue = calculateLowestLocationValue(locationMap!);
	return lowestLocationValue;
};
const runInputData = () => {
	const inputData = readInputFile('day5', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return runTestInputData(inputData);
};

console.log('Test Input: ' + runTestInputData(testString));
console.log('Real Input: ' + runInputData());
