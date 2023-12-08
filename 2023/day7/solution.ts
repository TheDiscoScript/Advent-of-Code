import { run } from 'node:test';
import { getRows } from '../utilities/get-rows';

interface CardsStrength {
	1: 2;
	2: 3;
	3: 4;
	4: 5;
	5: 6;
	6: 7;
	7: 8;
	8: 9;
	10: 'T';
	11: 'J';
	12: 'Q';
	13: 'K';
	14: 'A';
}
interface ComboStrength {
	1: 'high card';
	2: 'one pair';
	3: 'two pairs';
	4: 'three of a kind';
	5: 'full house';
	6: 'four of a kind';
	7: 'five of a kind';
}
type Hand = {
	base: string;
	bid: number;
	type: ComboStrength[keyof ComboStrength];
	positionInSet: number;
	totalWinnings: number;
};
const testString = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
123AK 1000
2134K 1000
K1234 1111`;
const comboStrent: ComboStrength = {
	1: 'high card',
	2: 'one pair',
	3: 'two pairs',
	4: 'three of a kind',
	5: 'full house',
	6: 'four of a kind',
	7: 'five of a kind',
};
const cardsStrength: CardsStrength = {
	1: 2,
	2: 3,
	3: 4,
	4: 5,
	5: 6,
	6: 7,
	7: 8,
	8: 9,
	10: 'T',
	11: 'J',
	12: 'Q',
	13: 'K',
	14: 'A',
};
const LOG = false;

const determineCombo = (hand: string): ComboStrength[keyof ComboStrength] => {
	const cardCounts = new Map<string, number>();
	if (LOG) console.log('🚀 ~ file: solution.ts:65 ~ determineCombo ~ cardCounts BEFORE:', cardCounts);
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
			return 'five of a kind';
		case 2:
			return counts[0] === 4 ? 'four of a kind' : 'full house';
		case 3:
			return counts[0] === 3 ? 'three of a kind' : 'two pairs';
		case 4:
			return 'one pair';
		default:
			return 'high card';
	}
};
const createMapOfCombosFromCards = (input: string): Map<string, Hand[]> => {
	const combosMap = new Map<ComboStrength[keyof ComboStrength], Hand[]>();
	const rows = getRows(input);
	if (LOG) console.log('🚀 ~ file: solution.ts:42 ~ createMapOfCards ~ rows:', rows);
	for (let i = 0; i < rows.length; i++) {
		const [hand, bid] = rows[i].split(' ');
		const combo = determineCombo(hand);
		if (!combosMap.has(combo)) combosMap.set(combo, [{ base: hand, bid: Number(bid), type: combo, positionInSet: 0, totalWinnings: 0 }]);
		else combosMap.get(combo)?.push({ base: hand, bid: Number(bid), type: combo, positionInSet: 0, totalWinnings: 0 });
	}

	return combosMap;
};
const calculatePositions = (combosMap: Map<string, Hand[]>): Map<string, Hand[]> | void => {
	let start = 1;
	const highCards = combosMap.get('high card');
	if (highCards && highCards?.length > 0) {
		if (highCards.length === 1) {
			highCards[0].positionInSet = 1;
			highCards[0].totalWinnings = highCards[0].bid * highCards[0].positionInSet;
		}
		if (highCards.length > 2) {
			highCards.sort(compareHands).reverse();
		}

		start += highCards?.length;
	}
	console.log('🚀 ~ file: solution.ts:112 ~ calculatePositions ~ highCards:', highCards);

	const onePairs = combosMap.get('one pair');
	if (onePairs && onePairs?.length > 0) {
		if (onePairs.length === 1) {
			onePairs[0].positionInSet = start;
			onePairs[0].totalWinnings = onePairs[0].bid * onePairs[0].positionInSet;
		}
		if (onePairs.length >= 2) {
			onePairs.sort(compareHands).reverse();
		}
		start += onePairs?.length;
	}

	const twoPairs = combosMap.get('two pairs');
	if (twoPairs && twoPairs?.length > 0) {
		if (twoPairs.length === 1) {
			twoPairs[0].positionInSet = start;
			twoPairs[0].totalWinnings = twoPairs[0].bid * twoPairs[0].positionInSet;
		}
		console.log('🚀 ~ file: solution.ts:138 ~ calculatePositions ~ twoPairs:', twoPairs.length);
		if (twoPairs.length >= 2) {
			twoPairs.sort(compareHands).reverse();
		}
		start += twoPairs?.length;
	}

	console.log('🚀 ~ file: solution.ts:138 ~ calculatePositions ~ twoPairs:', twoPairs);

	// const threeOfAKind = combosMap.get('three of a kind');
	// const threeOfAKindStartPosition = twoPairsStartPosition + (threeOfAKind?.length ?? 0);
	// const fullHouse = combosMap.get('full house');
	// const fullHouseStartPosition = threeOfAKindStartPosition + (fullHouse?.length ?? 0);
	// const fourOfAKind = combosMap.get('four of a kind');
	// const fourOfAKindStartPosition = fullHouseStartPosition + (fourOfAKind?.length ?? 0);
	// const fiveOfAKind = combosMap.get('five of a kind');
	// const fiveOfAKindStartPosition = fourOfAKindStartPosition + (fiveOfAKind?.length ?? 0);

	return;
};
const runTestInput = (input: string) => {
	const combosMap = createMapOfCombosFromCards(input);
	if (LOG) console.log('🚀 ~ file: solution.ts:42 ~ runTestInput ~ combosMap:', combosMap);
	calculatePositions(combosMap);
};
runTestInput(testString);

// Function to get the strength of a card
function getCardStrength(card: string): number {
	const cardValue = card === 'T' ? 10 : card === 'J' ? 11 : card === 'Q' ? 12 : card === 'K' ? 13 : card === 'A' ? 14 : parseInt(card);
	//@ts-ignore
	return cardsStrength[cardValue] || 0;
}

// Comparison function for two hands
function compareHands(hand1: Hand, hand2: Hand): number {
	const hand1Values = hand1.base.split('').map(getCardStrength);
	const hand2Values = hand2.base.split('').map(getCardStrength);

	for (let i = 0; i < Math.min(hand1Values.length, hand2Values.length); i++) {
		if (hand1Values[i] !== hand2Values[i]) {
			return hand2Values[i] - hand1Values[i];
		}
	}
	return 0;
}
