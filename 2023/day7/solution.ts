import { getRows } from '../utilities/get-rows';
import { readInputFile } from '../utilities/file-reader';

enum HandsStrength {
	'five of a kind' = 6000,
	'four of a kind' = 5000,
	'full house' = 4000,
	'three of a kind' = 3000,
	'two pairs' = 2000,
	'one pair' = 1000,
	'high card' = 0,
}
interface Hand {
	hand: string;
	bid: number;
	strength: number;
}

const testString = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const LOG = false;
const CARDS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

function getHandAndBid(row: string): [string, number] {
	const [hand, bid] = row.split(' ');
	return [hand, Number(bid)];
}
function handStrenght(hand: string): number {
	const cardCounts = new Map<string, number>();
	for (const card of hand) {
		if (card !== ' ') {
			cardCounts.set(card, (cardCounts.get(card) || 0) + 1);
		}
	}
	if (LOG) console.log('🚀 ~ file: solution.ts:65 ~ determineCombo ~ cardCounts AFTER:', cardCounts);
	const counts = Array.from(cardCounts.values());
	if (LOG) console.log('🚀 ~ file: solution.ts:73 ~ determineCombo ~ counts:', counts);
	counts.sort((a, b) => b - a); // Sort in descending order

	switch (counts.length) {
		case 1:
			return HandsStrength['five of a kind'];
		case 2:
			return counts[0] === 4 ? HandsStrength['four of a kind'] : HandsStrength['full house'];
		case 3:
			return counts[0] === 3 ? HandsStrength['three of a kind'] : HandsStrength['two pairs'];
		case 4:
			return HandsStrength['one pair'];
		default:
			return HandsStrength['high card'];
	}
}

function runTestInput(input: string) {
	const rows = getRows(input);
	if (LOG) console.log('🚀 ~ file: solution.ts:59 ~ runTestInput ~ rows:', rows);
	const hands: Hand[] = rows.map((e) => {
		const [hand, bid] = getHandAndBid(e);
		return { hand, bid, strength: handStrenght(hand) };
	});
	if (LOG) console.log('🚀 ~ file: solution.ts:61 ~ runTestInput ~ hands:', hands);
	hands.sort(compareHands);
	if (LOG) console.log('🚀 ~ file: solution.ts:70 ~ runTestInput ~ hands:', hands);

	const totalWinning = hands.reduce((acc, curr, index) => acc + curr.bid * (index + 1), 0);
	if (LOG) console.log('🚀 ~ file: solution.ts:71 ~ runTestInput ~ totalWinning:', totalWinning);
	return totalWinning;

	function compareHands(hand1: Hand, hand2: Hand) {
		if (hand1.strength > hand2.strength) return +1; // hand1 is stronger
		else if (hand1.strength < hand2.strength) return -1; // hand2 is stronger
		else {
			// same value, so we are comparing same TYPES of hands
			for (let i = 0; i < hand1.hand.length; i++) {
				const card1 = hand1.hand[i];
				const card2 = hand2.hand[i];
				// return CARDS.indexOf(card1) - CARDS.indexOf(card2);
				if (CARDS.indexOf(card1) > CARDS.indexOf(card2)) {
					return -1;
				} else if (CARDS.indexOf(card1) < CARDS.indexOf(card2)) {
					return +1;
				}
			}
			return 0;
		}
	}
}
function runInputData() {
	const inputData = readInputFile('day7', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return runTestInput(inputData);
}

console.log('Test Input: ' + runTestInput(testString));
console.log('Real Input: ' + runInputData()); //252164303
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
const CARDS_PART_TWO = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
function handStrenghtPartTwo(hand: string): number {
	const cardCounts = new Map<string, number>();
	for (const card of hand) {
		if (card == 'J') continue;
		if (card !== ' ') {
			cardCounts.set(card, (cardCounts.get(card) || 0) + 1);
		}
	}
	const counts = Array.from(cardCounts.values());
	let cardCountSize = 0;
	cardCounts.forEach((value, key) => {
		cardCountSize += value;
	});

	if (LOG) console.log('🚀 ~ file: solution.ts:65 ~ determineCombo ~ cardCounts AFTER:', cardCounts);
	counts.sort((a, b) => b - a); // Sort in descending order
	if (LOG) console.log('🚀 ~ file: solution.ts:73 ~ determineCombo ~ counts:', counts);

	if (cardCountSize == 5) {
		//unchanged - no joker
		switch (counts.length) {
			case 1:
				return HandsStrength['five of a kind'];
			case 2:
				return counts[0] === 4 ? HandsStrength['four of a kind'] : HandsStrength['full house'];
			case 3:
				return counts[0] === 3 ? HandsStrength['three of a kind'] : HandsStrength['two pairs'];
			case 4:
				return HandsStrength['one pair'];
			default:
				return HandsStrength['high card'];
		}
	} else {
		//we have jokers
		if (cardCountSize == 0 || cardCountSize == 1) {
			return HandsStrength['five of a kind'];
		} else if (cardCountSize == 2) {
			//we have 2 cards the same
			if (counts[0] == 2) {
				return HandsStrength['five of a kind'];
			} else if (counts[0] == 1) {
				return HandsStrength['four of a kind'];
			}
		} else if (cardCountSize == 3) {
			//JJ
			//999 --> five of a kind
			//998 --> four of a kind - not full house- four is better
			//987 --> three of a kind
			//we have 3 cards the same
			if (counts[0] == 3) {
				return HandsStrength['five of a kind'];
			} else if (counts[0] == 2) {
				return HandsStrength['four of a kind'];
			} else if (counts[0] == 1) {
				return HandsStrength['three of a kind'];
			}
		} else if (cardCountSize == 4) {
			//J
			// 9999 --> five of a kind
			// 9998 --> four of a kind - not full house- four is better
			// 9988 --> full house
			// 9987 --> three of a kind  - not two pairs
			// 9865 --> one pair

			//we have 4 cards the same
			if (counts[0] == 4) {
				return HandsStrength['five of a kind'];
			} else if (counts[0] == 3) {
				return HandsStrength['four of a kind'];
			} else if (counts[0] == 2) {
				//one J, two cards same and two another same
				if (counts[1] == 2) {
					return HandsStrength['full house'];
				}
				//one J, two cards same and two different
				else if (counts[1] == 1) {
					return HandsStrength['three of a kind'];
				}
			} else if (counts[0] == 1) {
				return HandsStrength['one pair'];
			}
		}

		return HandsStrength['high card'];
	}
}

function runTestInputPartTwo(input: string) {
	const rows = getRows(input);
	if (LOG) console.log('🚀 ~ file: solution.ts:108 ~ runTestInputPartTwo ~ rows:', rows);
	const hands: Hand[] = rows.map((e) => {
		const [hand, bid] = getHandAndBid(e);
		return { hand, bid, strength: handStrenghtPartTwo(hand) };
	});
	if (LOG) console.log('🚀 ~ file: solution.ts:113 ~ consthands:Hand[]=rows.map ~ hands:', hands);

	hands.sort(compareHands);
	if (LOG) console.log('🚀 ~ file: solution.ts:118 ~ runTestInputPartTwo ~ hands - SORT:', hands);

	if (LOG) console.log(hands);
	const totalWinning = hands.reduce((acc, curr, index) => acc + curr.bid * (index + 1), 0);
	if (LOG) console.log('🚀 ~ file: solution.ts:118 ~ runTestInputPartTwo ~ totalWinning:', totalWinning);
	return totalWinning;

	function compareHands(hand1: Hand, hand2: Hand) {
		if (hand1.strength > hand2.strength) return +1; // hand1 is stronger
		else if (hand1.strength < hand2.strength) return -1; // hand2 is stronger
		else {
			// same value, so we are comparing same TYPES of hands
			for (let i = 0; i < hand1.hand.length; i++) {
				const card1 = hand1.hand[i];
				const card2 = hand2.hand[i];
				// return CARDS.indexOf(card1) - CARDS.indexOf(card2);
				if (CARDS_PART_TWO.indexOf(card1) > CARDS_PART_TWO.indexOf(card2)) {
					return -1;
				} else if (CARDS_PART_TWO.indexOf(card1) < CARDS_PART_TWO.indexOf(card2)) {
					return +1;
				}
			}
			return 0;
		}
	}
}

function runInputDataPartTwo() {
	const inputData = readInputFile('day7', 'input.txt');
	if (!inputData) throw new Error('No input data');
	return runTestInputPartTwo(inputData);
}

console.log('Test Input Part Two: ' + runTestInputPartTwo(testString));
console.log('Real Input Part Two: ' + runInputDataPartTwo());
