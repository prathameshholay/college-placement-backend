// 📁 controllers/studentController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO Students (name, email, password_hash) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Student registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM Students WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid email' });
    const student = results[0];
    const match = await bcrypt.compare(password, student.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: student.student_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

exports.getProfile = (req, res) => {
  const sql = `SELECT * FROM Students WHERE student_id = ?`;
  db.query(sql, [req.student.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Profile not found' });
    res.json(results[0]);
  });
};

exports.updateProfile = (req, res) => {
  const updates = req.body;
  const sql = `UPDATE Students SET ? WHERE student_id = ?`;
  db.query(sql, [updates, req.student.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Profile updated successfully' });
  });
};

exports.deleteProfile = (req, res) => {
  const sql = `DELETE FROM Students WHERE student_id = ?`;
  db.query(sql, [req.student.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Profile deleted successfully' });
  });
};

exports.uploadResume = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const resumeTextPath = path.join(__dirname, '..', 'uploads', `${Date.now()}-resume.txt`);
  const resumeText = `Name: ${req.body.name || ''}\nSkills: ${req.body.skills || ''}`;

  fs.writeFileSync(resumeTextPath, resumeText);
  const resumePath = resumeTextPath.replace(/\\/g, '/');
  const sql = `UPDATE Students SET resume_link = ? WHERE student_id = ?`;
  db.query(sql, [resumePath, req.student.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Resume uploaded successfully', path: resumePath });
  });
};
