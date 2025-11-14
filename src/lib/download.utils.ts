"use server";

import fs from "fs/promises";
import path from "path";

export async function downloadFile(filename: string) {
  const filePath = path.join(process.cwd(), "public", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    // Determine content type based on file extension
    const fileExtension = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";
    if (fileExtension === ".pdf") {
      contentType = "application/pdf";
    } else if (fileExtension === ".png") {
      contentType = "image/png";
    } // Add more content types as needed

    return {
      fileBuffer: fileBuffer.toString("base64"), // Send as base64 string
      contentType: contentType,
      fileName: filename,
    };
  } catch (error) {
    console.error("Error reading file:", error);
    return { error: "File not found or inaccessible" };
  }
}
