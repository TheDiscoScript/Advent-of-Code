"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInputFile = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function readInputFile(folder, inputFilename) {
    try {
        const filePath = path_1.default.join(__dirname, '..', folder, inputFilename);
        const data = (0, fs_1.readFileSync)(filePath, 'utf8');
        return data;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
exports.readInputFile = readInputFile;
