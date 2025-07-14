const express = require('express');
const { authenticate } = require('../middleware/auth');
const { submitTest, getLeaderboard } = require('../controllers/submitController');

const router = express.Router();
router.post('/submit', authenticate, submitTest);
router.get('/leaderboard/:testId', getLeaderboard);

module.exports = router;
