require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

async function uploadImage() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        console.error('Error: BLOB_READ_WRITE_TOKEN is not defined in .env.local');
        process.exit(1);
    }

    const filePath = path.join(__dirname, '../public/images/cat_beauty.png');
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    const file = fs.readFileSync(filePath);

    try {
        console.log('Uploading cat_beauty.png to Vercel Blob...');
        // We use addRandomSuffix: false to try and match the expected URL structure
        const blob = await put('seed/cat_beauty.png', file, {
            access: 'public',
            token: token,
            addRandomSuffix: false
        });

        console.log('Successfully uploaded!');
        console.log('Blob URL:', blob.url);
    } catch (error) {
        console.error('Upload failed:', error);
        process.exit(1);
    }
}

uploadImage();
