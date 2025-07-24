const fs = require('fs').promises;
const path = require('path');

async function deleteFile(filePath) {
    try {
        console.log(`Deleting file: ${filePath}`);

        await fs.unlink(filePath);
        console.log('File deleted');
    } catch (err) {
        console.error('Delete failed:', err.message);
    }
}
// export default deleteFile;
module.exports = deleteFile;