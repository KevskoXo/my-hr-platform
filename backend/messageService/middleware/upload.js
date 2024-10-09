// middleware/upload.js

const multer = require('multer');
const path = require('path');

// Speicherort und Dateinamen definieren
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Stelle sicher, dass das Verzeichnis existiert
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Dateityp-Filter
const fileFilter = (req, file, cb) => {
  // Erlaube nur bestimmte Dateitypen (z.B. Bilder, Videos, PDFs)
  const allowedTypes = /jpeg|jpg|png|gif|mp4|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Nur bestimmte Dateitypen sind erlaubt.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Begrenze die Dateigröße auf 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
