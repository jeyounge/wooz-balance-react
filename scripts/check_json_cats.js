
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/questions_v3.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const questions = JSON.parse(rawData);

const categories = new Set();
questions.forEach(q => categories.add(`'${q.category}'`)); // Wrap in quotes to see whitespace

console.log("Categories in JSON:", Array.from(categories));
