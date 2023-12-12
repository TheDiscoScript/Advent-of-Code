import { readInputFile } from '../utilities/file-reader';
import { getRows } from '../utilities/get-rows';

/**
In the giant field just outside, the springs are arranged into rows.
 For each row, the condition records show every spring and whether
  it is operational (.) or damaged (#). This is the part of the condition 
  records that is itself damaged; for some springs, it is simply unknown
   (?) whether the spring is operational or damaged.
 
???.### 1,1,3 - 1 arrangement
.??..??...?##. 1,1,3 - 4 arrangements
?#?#?#?#?#?#?#? 1,3,1,6 - 1 arrangement
????.#...#... 4,1,1 - 1 arrangement
????.######..#####. 1,6,5 - 4 arrangements
?###???????? 3,2,1 - 10 arrangements
 */

//`???.### 1,1,3
//.??..??...?##. 1,1,3
//?#?#?#?#?#?#?#? 1,3,1,6
//????.#...#... 4,1,1
//????.######..#####. 1,6,5
//?###???????? 3,2,1`;
const LOG = false;
const LOG_2 = false;
const testString = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

// i will try to do this recursevely
// this is similar to tree structure - we are branching out with each recursive checking
let cache = new Map<string, number>();

function countF(config: string, numbers: number[], pathId = '') {
	if (LOG) console.log(`Path ID: ${pathId} -- Config: ${config} -- Numbers: ${numbers}`);

	//THIS IS REAL COUNTER INCREMENTATION
	if (config === '') {
		if (LOG_2) console.log('Exiting because config is empty');
		// config is empty and we are checking if there are any numbers left to use
		// if numbers is not empty, then we have a bad config because we are expecting valid config
		return numbers.length === 0 ? 1 : 0;
	}

	//THIS IS REAL COUNTER INCREMENTATION
	if (numbers.length === 0) {
		if (LOG_2) console.log('Exiting because Numbers are empty');
		// numbers is empty and we are checking if there are any configs left to use
		// if config is not empty, then we have a bad config because we are expecting valid numbers
		return config.includes('#') ? 0 : 1;
	}

	const cacheKey = `${config}-${numbers.join(',')}`;
	if (cache.has(cacheKey)) {
		return cache.get(cacheKey)!;
	}

	let counter = 0;

	if (['.', '?'].includes(config[0])) {
		if (LOG_2) console.log('Recursive call 1');
		//if config[0] is . or ? then we can use it and move on to the next config after removing first char
		counter += countF(config.substring(1), numbers, pathId + '1');
	}

	if (['#', '?'].includes(config[0])) {
		if (LOG_2) console.log('Recursive call 2');
		//we need to value of number and length of remaining config
		const firstCondition = numbers[0] <= config.length;
		//there cant be any . in the first n numbers
		const secondCondition = !config.substring(0, numbers[0]).includes('.');
		//next string must be operational or we are at the end of the config
		const thirdCondition = numbers[0] === config.length || config[numbers[0]] !== '#';
		if (firstCondition && secondCondition && thirdCondition) {
			counter += countF(config.substring(numbers[0] + 1), numbers.slice(1), pathId + '2');
		} else {
			counter += 0;
		}
	}

	cache.set(cacheKey, counter);
	return counter;
}
const run = (input: string, partTwo?: boolean) => {
	let total = 0;

	const rows = getRows(input);
	let i = 0;
	for (const row of rows) {
		console.log('-----------NEW ROW NUMBER : ' + i++);
		console.log(row);

		let [config, numStr] = row.split(' ');
		const nums = numStr.split(',').map((n) => parseInt(n));
		if (partTwo) {
			//config join with "?" and repeat 5 times
			//nums repeat 5 times
			config = Array(5).fill(config).join('?');
			const numsRepeated = Array(5).fill(nums).flat();
			total += countF(config, numsRepeated);
		} else {
			total += countF(config, nums);
		}
		console.log('🚀 ~ file: solution.ts:82 ~ run ~ total:', total);
	}

	return total;
};

//console.log('Test Input: ' + run(testString, true));
const realInput = readInputFile('day12', 'input.txt')!;
console.time('Real Input');
const dStart = new Date();
console.log('Real Input: ' + run(realInput, true));
console.timeEnd('Real Input');
console.log('Time: ' + (new Date().getTime() - dStart.getTime()) / 1000 + 's');
