"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_reader_1 = require("../utilities/file-reader");
const testInputPart1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
//12+
//38+
//15+
//77 = 142
const getCalibrationStrings = (input) => {
    return input.split('\n');
};
const getCalibrationValue = (input) => {
    const digits = input
        .split('')
        .map((e) => parseInt(e))
        .filter((e) => !isNaN(e));
    return parseInt(`${digits[0]}` + `${digits[digits.length - 1]}`);
};
const runPart1 = (input) => {
    const calibrationStrings = getCalibrationStrings(input);
    const calibrationValues = calibrationStrings.map(getCalibrationValue);
    return calibrationValues.reduce((acc, curr) => acc + curr, 0);
};
const runInputData = () => {
    const inputData = (0, file_reader_1.readInputFile)('day1', 'input.txt');
    if (!inputData) {
        console.log('Could not read input data');
        return;
    }
    return runPart1(inputData);
};
console.log('Test Input: ' + runPart1(testInputPart1));
console.log('Real Input: ' + runInputData());
// PART 2 //
const testInputPart2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;
//29+
//83+
//13+
//24+
//42+
//14+
//76 = 281
const getCalibrationValueModified = (input) => {
    const dictionary = {
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
    };
    let left = '';
    let right = '';
    let backAdder = '';
    for (let i = 0; i < input.length; i++) {
        if (left !== '')
            break;
        const element = input[i];
        if (!isNaN(parseInt(element))) {
            left = element;
            break;
        }
        backAdder = backAdder + element;
        if (backAdder.length >= 3) {
            for (let key of Object.keys(dictionary)) {
                if (backAdder.includes(key)) {
                    left = dictionary[key];
                    break;
                }
            }
        }
    }
    let forwardAdder = '';
    for (let i = input.length; i >= 0; i--) {
        if (right !== '')
            break;
        const element = input[i];
        if (!isNaN(parseInt(element))) {
            right = element;
            break;
        }
        forwardAdder = element + forwardAdder;
        if (forwardAdder.length >= 3) {
            for (let key of Object.keys(dictionary)) {
                if (forwardAdder.includes(key)) {
                    right = dictionary[key];
                    break;
                }
            }
        }
    }
    return left + right;
};
const runPart2 = (input) => {
    const calibrationStrings = getCalibrationStrings(input);
    const calibrationValues = calibrationStrings.map(getCalibrationValueModified);
    return calibrationValues.reduce((acc, curr) => acc + parseInt(curr), 0);
};
const runInputDataPart2 = () => {
    const inputData = (0, file_reader_1.readInputFile)('day1', 'input.txt');
    if (!inputData) {
        console.log('Could not read input data');
        return;
    }
    return runPart2(inputData);
};
console.log('Test Input Part 2: ' + runPart2(testInputPart2));
console.log('Real Input Part 2: ' + runInputDataPart2());
