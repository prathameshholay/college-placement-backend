const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const auth = require('../middleware/auth');
const studentCtrl = require('../controllers/studentController');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Auth Routes
router.post('/register', studentCtrl.register);
router.post('/login', studentCtrl.login);
router.post('/logout', studentCtrl.logout);
// Protected Routes (Require JWT Auth)
router.get('/profile', auth, studentCtrl.getProfile);
router.put('/profile', auth, studentCtrl.updateProfile);
router.delete('/profile', auth, studentCtrl.deleteProfile);
router.post('/upload-resume', auth, upload.single('resume'), studentCtrl.uploadResume);

module.exports = router;
