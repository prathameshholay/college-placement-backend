const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const db = require('../models'); // ✅ Load models dynamically
const Student = db.Student;

// Register new student
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Student.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await Student.create({ name, email, password_hash: hashedPassword });

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login and set cookie
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ where: { email } });
    if (!student) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, student.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: student.student_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findByPk(req.student.id);
    if (!student) return res.status(404).json({ error: 'Profile not found' });

    res.json({
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      resume_link: student.resume_link,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    await Student.update(req.body, { where: { student_id: req.student.id } });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    await Student.destroy({ where: { student_id: req.student.id } });
    res.clearCookie('token');
    res.json({ message: 'Profile deleted and logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const resumeTextPath = path.join(__dirname, '..', 'uploads', `${Date.now()}-resume.txt`);
  const resumeText = `Name: ${req.body.name || ''}\nSkills: ${req.body.skills || ''}`;
  fs.writeFileSync(resumeTextPath, resumeText);
  const resumePath = resumeTextPath.replace(/\\/g, '/');

  try {
    await Student.update({ resume_link: resumePath }, { where: { student_id: req.student.id } });
    res.json({ message: 'Resume uploaded successfully', path: resumePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
