//creates new process basically shell in backend
const { exec } = require("child_process");
const fs = require('fs-extra');
const path = require('path');
const deleteFile = require("./utils/deleteFile.js");

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}


const executeCpp = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split('.')[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        const execCmd = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./$(basename ${outPath}) <${inputFilePath}`;
        exec(execCmd, async (error, stdout, stderr) => {
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
             // Delete output file after execution
            if (await fs.pathExists(outPath)) {
                await fs.remove(outPath);
            }
            else {
                console.log("no path");
            }
             
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
        exec(`python3 ${filePath} < ${inputFilePath}`, async (error, stdout, stderr) => {
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
            // if (await fs.pathExists(outPath)) {
            //     await fs.remove(outPath);
            // }
            // else {
            //     console.log("no path");
            // }
        });
    });
};

const executeJava = async (filePath, inputFilePath) => {
    // const jobId = path.basename(filePath).split('.')[0];
    return new Promise((resolve, reject) => {
        exec(`java ${filePath} < ${inputFilePath}`, async(error, stdout, stderr) => {
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
            // if (await fs.pathExists(outPath)) {
            //     await fs.remove(outPath);
            // }
            // else {
            //     console.log("no path");
            // }
        });
    });
};
// add diff commands for diff languages

// c compile: gcc filename.c - o filename.out
// c execute: ./ filename.out
// python: python3 filename.py
// java: java YourFile.java
module.exports = { executeCpp, executePython, executeJava };