import multer from "multer";
const storage = multer.memoryStorage();

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;
