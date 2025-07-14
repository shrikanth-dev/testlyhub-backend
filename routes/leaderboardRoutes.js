const express = require('express');
const router = express.Router();
const { submitToLeaderboard, getLeaderboard, getUserAttempts } = require('../controllers/leaderboardController');
const { authenticate } = require('../middleware/auth');

// Submit score to leaderboard
router.post('/submit', authenticate, submitToLeaderboard);


// GET /api/leaderboard/user
router.get('/user', authenticate, getUserAttempts);


// Get top scores for a test
router.get('/:testId', getLeaderboard);

module.exports = router;
