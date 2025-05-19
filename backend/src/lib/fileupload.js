import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Make sure the uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory at:", uploadsDir);
} else {
    console.log("Using existing uploads directory at:", uploadsDir);
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Creating file: ${filename}`);
        cb(null, filename);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        console.log("Rejected file:", file.originalname, "- not an allowed image type");
        return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    console.log("Accepted file:", file.originalname);
    cb(null, true);
};

// Configure the multer middleware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

console.log("File upload middleware configured successfully");

export default upload;