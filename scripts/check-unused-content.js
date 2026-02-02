import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../src/content');
const SRC_DIR = path.resolve(__dirname, '../src');

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
            keys = keys.concat(getKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

const jsonFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));
let allUnused = [];

const files = glob.sync('**/*.{ts,tsx}', { cwd: SRC_DIR, absolute: true });

for (const file of jsonFiles) {
    const fileContentRaw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const contentData = JSON.parse(fileContentRaw);
    const domain = file.replace('.json', '');
    const keys = getKeys(contentData, domain);

    const unusedKeys = keys.filter(key => {
        const parts = key.split('.');
        const baseKey = parts[parts.length - 1];

        let isUsed = false;
        for (const filePath of files) {
            if (filePath.includes('content') || filePath.includes('ContentContext')) continue;
            const fileText = fs.readFileSync(filePath, 'utf-8');
            if (fileText.includes(key) || fileText.includes(`['${baseKey}']`) || fileText.includes(`["${baseKey}"]`) || fileText.includes(`.${baseKey}`)) {
                isUsed = true;
                break;
            }
        }
        return !isUsed;
    });

    if (unusedKeys.length > 0) {
        allUnused.push({ file, keys: unusedKeys });
    }
}

if (allUnused.length > 0) {
    console.error('Found unused content keys:');
    allUnused.forEach(item => {
        console.error(`\nIn ${item.file}:`);
        item.keys.forEach(key => console.error(`  - ${key}`));
    });
    process.exit(1);
} else {
    console.log('No unused content keys found.');
}
