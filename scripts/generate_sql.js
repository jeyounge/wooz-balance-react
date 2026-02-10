
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/questions_v3.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const questions = JSON.parse(rawData);

let sql = `-- 1. 제약 조건 삭제 (강제)
ALTER TABLE balance_questions DROP CONSTRAINT IF EXISTS balance_questions_category_check;

-- 2. 데이터 삽입
INSERT INTO balance_questions (category, title, option_a, option_b, ai_comment_a, ai_comment_b, ai_commentary, count_a, count_b) VALUES
`;

questions.forEach((q, index) => {
    const escape = (str) => str ? str.replace(/'/g, "''") : '';
    
    sql += `('${q.category}', '${escape(q.title)}', '${escape(q.option_a)}', '${escape(q.option_b)}', '${escape(q.ai_comment_a)}', '${escape(q.ai_comment_b)}', '${escape(q.ai_commentary)}', 0, 0)`;
    
    if (index < questions.length - 1) {
        sql += ',\n';
    } else {
        sql += ';\n';
    }
});

fs.writeFileSync(path.join(__dirname, '../seed_v3_final.sql'), sql);
console.log("Generated seed_v3_final.sql");
