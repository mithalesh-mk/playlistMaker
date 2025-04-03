const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "vessel/playlist", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Multer middleware with size limit (max 2MB)
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      return cb(new Error("Only .jpg, .jpeg, and .png formats are allowed!"), false);
    }
    cb(null, true);
  },
});

// Error handling middleware (optional)
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    console.error("File size exceeds limit:", err);
    return res.status(400).json({ success: false, message: "File size exceeds 2MB limit!" });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

module.exports = { cloudinary, upload, uploadErrorHandler };

