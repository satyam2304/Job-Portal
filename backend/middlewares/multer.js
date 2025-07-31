import multer from "multer";

// Use memoryStorage to temporarily store the file buffer
const storage = multer.memoryStorage();

/**
 * Multer middleware to handle multiple file uploads for specific fields.
 * This is configured to accept:
 * - One file for the 'profilePhoto' field.
 * - One file for the 'resume' field.
 */
export const multipleUpload = multer({ storage }).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);

/**
 * You can keep the single upload middleware if you still need it elsewhere
 * for routes that only handle one file.
 */
export const singleUpload = multer({ storage }).single("profilePhoto");
