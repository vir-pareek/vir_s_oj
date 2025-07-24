const { dir } = require('console');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require("uuid");
const dirCodes = path.join(__dirname, 'codes');
const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateFile = (format, content) => {
    const jobId = uuid();
    const fileName = `${jobId}.${format}`;
    const filePath = path.join(dirCodes, fileName);
    fs.writeFileSync(filePath, content);
    return filePath;
}

const generateInputFile = (input) => {
    const jobId = uuid();
    const fileName = `${jobId}.txt`;
    const filePath = path.join(dirInputs, fileName);
    fs.writeFileSync(filePath, input);
    return filePath;
}

module.exports = { generateFile, generateInputFile };