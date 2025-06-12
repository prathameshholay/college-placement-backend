const db = require('../config/db');

// Get student profile
exports.getProfile = (req, res) => {
  const studentId = req.student.id;

  db.query('SELECT * FROM Students WHERE student_id = ?', [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results[0]);
  });
};

// Update student profile
exports.updateProfile = (req, res) => {
  const studentId = req.student.id;
  const { name, phone_no, dob, gender, course, year_of_passing, cgpa, skills, placement_status } = req.body;

  db.query(
    `UPDATE Students SET name = ?, phone_no = ?, dob = ?, gender = ?, course = ?, 
     year_of_passing = ?, cgpa = ?, skills = ?, placement_status = ? WHERE student_id = ?`,
    [name, phone_no, dob, gender, course, year_of_passing, cgpa, skills, placement_status, studentId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Profile updated successfully' });
    }
  );
};

// Delete student profile
exports.deleteProfile = (req, res) => {
  const studentId = req.student.id;

  db.query('DELETE FROM Students WHERE student_id = ?', [studentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Profile deleted successfully' });
  });
};
