import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

async function uploadImages() {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error("Error: BLOB_READ_WRITE_TOKEN is not set in .env.local");
        process.exit(1);
    }

    console.log("Starting upload to Vercel Blob...");

    try {
        const files = fs.readdirSync(IMAGES_DIR);
        const mapping: Record<string, string> = {};

        for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg|webp)$/i)) {
                const filePath = path.join(IMAGES_DIR, file);
                const fileBuffer = fs.readFileSync(filePath);

                console.log(`Uploading ${file}...`);

                const blob = await put(`seed/${file}`, fileBuffer, {
                    access: 'public',
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });

                console.log(`✓ Uploaded: ${blob.url}`);
                mapping[file] = blob.url;
            }
        }

        console.log("\n--- Upload Summary ---");
        console.log(JSON.stringify(mapping, null, 2));

        // Save mapping to a file for reference
        fs.writeFileSync("blob-mapping.json", JSON.stringify(mapping, null, 2));
        console.log("\nMapping saved to blob-mapping.json");

    } catch (error) {
        console.error("Upload failed:", error);
    }
}

uploadImages();
