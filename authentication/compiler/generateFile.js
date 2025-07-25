// const { dir } = require('console');
// const fs = require('fs');
// const path = require('path');
// const { v4: uuid } = require("uuid");
// const dirCodes = path.join(__dirname, 'codes');
// const dirInputs = path.join(__dirname, 'inputs');

// if (!fs.existsSync(dirCodes)) {
//     fs.mkdirSync(dirCodes, { recursive: true });
// }

// if (!fs.existsSync(dirInputs)) {
//     fs.mkdirSync(dirInputs, { recursive: true });
// }

// const generateFile = (format, content) => {
//     const jobId = uuid();
//     const fileName = `${jobId}.${format}`;
//     const filePath = path.join(dirCodes, fileName);
//     fs.writeFileSync(filePath, content);
//     return filePath;
// }

// const generateInputFile = (input) => {
//     const jobId = uuid();
//     const fileName = `${jobId}.txt`;
//     const filePath = path.join(dirInputs, fileName);
//     fs.writeFileSync(filePath, input);
//     return filePath;
// }

// module.exports = { generateFile, generateInputFile };

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
    // --- NEW LOGIC FOR JAVA ---
    if (format === 'java') {
        // Regular expression to find the public class name
        const regex = /public\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/;
        const match = content.match(regex);

        let className = 'Main'; // Default fallback
        if (match && match[1]) {
            className = match[1];
        } else {
            // Optional: If you want to force users to have a public class,
            // you could throw an error here. For now, we'll fall back to 'Main'.
            console.warn("No public class found in Java code, falling back to 'Main.java'");
        }

        const jobDir = path.join(dirCodes, uuid());
        fs.mkdirSync(jobDir, { recursive: true });
        // Save the file with the detected class name
        const filePath = path.join(jobDir, `${className}.java`);
        fs.writeFileSync(filePath, content);
        return filePath;
    }
    else {
        const jobId = uuid();
        const fileName = `${jobId}.${format}`;
        const filePath = path.join(dirCodes, fileName);
        fs.writeFileSync(filePath, content);
        return filePath;
    }
};

const generateInputFile = (input) => {
    const jobId = uuid();
    const fileName = `${jobId}.txt`;
    const filePath = path.join(dirInputs, fileName);
    fs.writeFileSync(filePath, input);
    return filePath;
};

module.exports = {
    generateFile,
    generateInputFile
};