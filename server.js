// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Database connection
const db = require('./config/db');

// Register models so Sequelize knows about them
require('./models/User');
require('./models/TestModel');
require('./models/Order');
require('./models/Leaderboard');

// Import routes
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const submitRoutes = require('./routes/submitRoutes');
const recommendRoutes = require('./routes/recommendRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/submit', submitRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/leaderboard', leaderboardRoutes); 

// ✅ Test DB connection and sync models
(async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connected');

    await db.sync({ alter: true }); // use { force: true } for hard reset
    console.log('✅ All models synced!');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

