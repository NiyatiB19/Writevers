import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export const readData = (fileName, defaultData = []) => {
    const filePath = path.join(dataDir, fileName);
    try {
        if (!fs.existsSync(filePath)) {
            // Initialize with default data if file doesn't exist
            writeData(fileName, defaultData);
            return defaultData;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return defaultData;
    }
};

export const writeData = (fileName, data) => {
    const filePath = path.join(dataDir, fileName);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing ${fileName}:`, error);
    }
};
