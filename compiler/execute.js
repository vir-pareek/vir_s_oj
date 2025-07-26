import { exec } from "child_process";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const EXECUTION_TIMEOUT = 10000; // 10 seconds

const executeCodeInDocker = (command, filePath, inputFilePath) => {
    const codeDir = path.dirname(filePath);
    const inputDir = path.dirname(inputFilePath);

    const dockerCmd = `docker run --rm \
        -v "${codeDir}:/usr/src/app" \
        -v "${inputDir}:/usr/src/inputs" \
        -w /usr/src/app \
        codejoy-compiler \
        bash -c '${command}'`;

    return new Promise((resolve, reject) => {
        exec(dockerCmd, { timeout: EXECUTION_TIMEOUT }, async (error, stdout, stderr) => {
            if (filePath.endsWith('.java')) {
                try {
                    await fs.promises.rm(codeDir, { recursive: true, force: true });
                } catch (err) {
                    console.error(`Failed to cleanup dir ${codeDir}:`, err);
                }
            }
            if (error) {
                if (error.killed) return reject("Time Limit Exceeded");
                return reject(stderr || error.message);
            }
            if (stderr) {
                console.error(`Execution STDERR: ${stderr}`);
            }
            resolve(stdout);
        });
    });
};

export const executeCpp = (filePath, inputFilePath) => {
    const codeFile = path.basename(filePath);
    const inputFile = `/usr/src/inputs/${path.basename(inputFilePath)}`;
    const command = `g++ ${codeFile} -o a.out && ./a.out < ${inputFile}; rm a.out`;
    return executeCodeInDocker(command, filePath, inputFilePath);
};

export const executePython = (filePath, inputFilePath) => {
    const codeFile = path.basename(filePath);
    const inputFile = `/usr/src/inputs/${path.basename(inputFilePath)}`;
    const command = `python3 ${codeFile} < ${inputFile}`;
    return executeCodeInDocker(command, filePath, inputFilePath);
};

export const executeJava = (filePath, inputFilePath) => {
    const className = path.basename(filePath, '.java');
    const inputFile = `/usr/src/inputs/${path.basename(inputFilePath)}`;
    const command = `javac ${className}.java && java ${className} < ${inputFile}`;
    return executeCodeInDocker(command, filePath, inputFilePath);
};