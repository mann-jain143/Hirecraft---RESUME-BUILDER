import multer from 'multer';
import path from 'path';

// Use memory storage so the file buffer is available on req.file.buffer
const storage = multer.memoryStorage();

// Only allow PDF and DOCX files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf and .docx files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;
