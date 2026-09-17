const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 1. إعداد حساب Cloudinary الخاص بك (ستحصل على هذه البيانات من موقعهم)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000
});

// 2. إعداد مكان التخزين
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Evo Store", 
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });
module.exports = upload;