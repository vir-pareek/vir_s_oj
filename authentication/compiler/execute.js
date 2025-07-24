//creates new process basically shell in backend
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}


const executeCpp = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split('.')[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        const execCmd = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./$(basename ${outPath}) <${inputFilePath}`;
        exec(execCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) { // compilation and runtime errors
                console.error(`Stderr: ${stderr}`);
                reject(stderr);
                return;
            }
            console.log(`Stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

// const executeC = async (filePath) => {
//     const jobId = path.basename(filePath).split('.')[0];
//     const outPath = path.join(outputPath, `${jobId}.out`);
//     return new Promise((resolve, reject) => {
//         exec(`gcc ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error: ${error.message}`);
//                 reject(error);
//                 return;
//             }
//             if (stderr) {//compilation and runtime errors
//                 console.error(`Stderr: ${stderr}`);
//                 reject(stderr);
//                 return;
//             }
//             console.log(`Stdout: ${stdout}`);
//             resolve(stdout);
//         });
//     });
// };

const executePython = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split('.')[0];
    return new Promise((resolve, reject) => {
        exec(`python3 ${filePath} < ${inputFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {//compilation and runtime errors
                console.error(`Stderr: ${stderr}`);
                reject(stderr);
                return;
            }
            console.log(`Stdout: ${stdout}`);
            resolve(stdout);
        });
    });
};

const executeJava = async (filePath, inputFilePath) => {
    // const jobId = path.basename(filePath).split('.')[0];
    return new Promise((resolve, reject) => {
        exec(`java ${filePath} < ${inputFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {//compilation and runtime errors
                console.error(`Stderr: ${stderr}`);
                reject(stderr);
                return;
            }
            console.log(`Stdout: ${stdout}`);
            resolve(stdout);
        });
    });
};
// add diff commands for diff languages

// c compile: gcc filename.c - o filename.out
// c execute: ./ filename.out
// python: python3 filename.py
// java: java YourFile.java
module.exports = { executeCpp, executePython, executeJava };