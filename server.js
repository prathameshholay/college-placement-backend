const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // ✅ Add this
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const db = require('./models'); // This uses config/sequilize

const app = express();

// ✅ CORS setup (keep this before routes and sessions)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ SESSION middleware must come BEFORE your routes
app.use(session({
  secret: 'your-secret-key', // 🔐 keep it safe in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // Use true only with HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// ✅ Routes (after session setup)
app.use('/api/students', studentRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;

// ⛓️ Sync DB and start server
db.sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Sequelize connected & models synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Sequelize connection error:', err.message);
});
