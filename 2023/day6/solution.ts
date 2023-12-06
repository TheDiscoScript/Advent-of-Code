// Time:      7  15   30
// Distance:  9  40  200

import { readInputFile } from '../utilities/file-reader';

//This document describes three races:
//
//The first race lasts 7 milliseconds. The record distance in this race is 9 millimeters.
//The second race lasts 15 milliseconds. The record distance in this race is 40 millimeters.
//The third race lasts 30 milliseconds. The record distance in this race is 200 millimeters`;

//Your toy boat has a starting speed of zero millimeters per millisecond.
//For each whole millisecond you spend at the beginning of the race holding down the button,
// the boat's speed increases by one millimeter per millisecond.

// So, because the first race lasts 7 milliseconds, you only have a few options:

// Don't hold the button at all (that is, hold it for 0 milliseconds) at the start of the race. The boat won't move; it will have traveled 0 millimeters by the end of the race.
// Hold the button for 1 millisecond at the start of the race. Then, the boat will travel at a speed of 1 millimeter per millisecond for 6 milliseconds, reaching a total distance traveled of 6 millimeters.
// Hold the button for 2 milliseconds, giving the boat a speed of 2 millimeters per millisecond. It will then get 5 milliseconds to move, reaching a total distance of 10 millimeters.
// Hold the button for 3 milliseconds. After its remaining 4 milliseconds of travel time, the boat will have gone 12 millimeters.
// Hold the button for 4 milliseconds. After its remaining 3 milliseconds of travel time, the boat will have gone 12 millimeters.
// Hold the button for 5 milliseconds, causing the boat to travel a total of 10 millimeters.
// Hold the button for 6 milliseconds, causing the boat to travel a total of 6 millimeters.
// Hold the button for 7 milliseconds. That's the entire duration of the race.
//You never let go of the button. The boat can't move until you let go of the button.
// Please make sure you let go of the button so the boat gets to move. 0 millimeters.

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
function calculateNumOfMultipliedNumbersOfRecordsBreaking(races: Race[]) {
	return races.map((e) => (e.numberOfWaysToBeatRecord !== 0 ? e.numberOfWaysToBeatRecord : 1)).reduce((a, b) => a * b);
}
// Function to parse the input string
function parseInput(input: string): Race[] {
	const lines = input.split('\n');
	const times = lines[0].split(':').pop()!.trim().split(/\s+/).map(Number);
	const distances = lines[1].split(':').pop()!.trim().split(/\s+/).map(Number);

	return times.map((time, index) => {
		return {
			raceTime: time,
			recordDistance: distances[index],
			numberOfWaysToBeatRecord: calculateNumberOfWaysToBeatRecord(time, distances[index]),
		};
	});
}

const runTestInputData = (input: string) => {
	const parsedData = parseInput(input);
	return calculateNumOfMultipliedNumbersOfRecordsBreaking(parsedData);
};
const runInputData = () => {
	const input = readInputFile('day6', 'input.txt');
	if (!input) throw new Error('Input file not found');
	const parsedData = parseInput(input);
	return calculateNumOfMultipliedNumbersOfRecordsBreaking(parsedData);
};
console.log('Test Input: ' + runTestInputData(testString));
console.log('Real Input: ' + runInputData());
