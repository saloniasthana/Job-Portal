import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const storage = multer.memoryStorage();

const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
}).single('resume');

export const uploadResumeFile = (req, res, next) => {
  resumeUpload(req, res, (err) => {
    if (err) return next(new ApiError(400, err.message));
    next();
  });
};
