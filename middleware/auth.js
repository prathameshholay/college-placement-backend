const jwt = require('jsonwebtoken');
const db = require('../models'); // ✅ Correct way to access models
const Student = db.Student;
require('dotenv').config();

module.exports = async function (req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findByPk(decoded.id); // ✅ id = student_id from token
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    req.student = student; // ✅ Full student object attached to req
    next();
  } catch (e) {
    console.error('JWT error:', e.message);
    return res.status(400).json({ msg: 'Invalid token' });
  }
};
