import { readFileSync } from 'fs';
import path from 'path';

export function readInputFile(folder: string, inputFilename: string) {
	try {
		const filePath = path.join(__dirname, '..', folder, inputFilename);
		const data = readFileSync(filePath, 'utf8');
		return data;
	} catch (err) {
		console.error(err);
		return null;
	}
}
