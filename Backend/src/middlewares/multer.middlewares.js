import path from "path";
import multer from "multer";
import fs from "fs";

// Ensure uploads folder exists
// const uploadFolder = "uploads";
// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder);
// }

const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (![".jpg", ".jpeg", ".webp", ".png", ".mp4"].includes(ext)) {
            return cb(new Error(`Unsupported file type! ${ext}`), false);
        }
        cb(null, true);
    },
});

export default upload;
