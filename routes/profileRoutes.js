// routes/profile.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const studentProfileController = require('../controllers/studentProfile');

/**
 * @route   POST /api/profile
 * @desc    Create or update student profile
 * @access  Private (requires authentication)
 */
router.post('/', auth, studentProfileController.createOrUpdateProfile);

/**
 * @route   GET /api/profile/me
 * @desc    Get logged-in student's profile
 * @access  Private (requires authentication)
 */
router.get('/me', auth, studentProfileController.getProfile);



/**
 * @route   DELETE /api/profile
 * @desc    Delete logged-in student's profile
 * @access  Private (requires authentication)
 */
router.delete('/', auth, studentProfileController.deleteProfile);

module.exports = router;
