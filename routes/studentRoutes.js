const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const studentCtrl = require('../controllers/studentController');
const profileCtrl = require('../controllers/studentProfile');

router.get('/profile', auth, profileCtrl.getProfile);
router.put('/profile', auth, profileCtrl.updateProfile);
router.delete('/profile', auth, profileCtrl.deleteProfile);


const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/register', studentCtrl.register);
router.post('/login', studentCtrl.login);
router.get('/profile', auth, studentCtrl.getProfile);
router.put('/profile', auth, studentCtrl.updateProfile);
router.delete('/profile', auth, studentCtrl.deleteProfile);
router.post('/upload-resume', auth, upload.single('resume'), studentCtrl.uploadResume);

module.exports = router;