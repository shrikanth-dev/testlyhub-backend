const Leaderboard = require('../models/Leaderboard');
const Test = require('../models/TestModel');
const User = require('../models/User');

// POST /api/leaderboard/submit
exports.submitToLeaderboard = async (req, res) => {
  const { testId, score, time_taken } = req.body;
  const userId = req.user.id;

  try {
    // Save or update the user's best score
    const [entry, created] = await Leaderboard.findOrCreate({
      where: { userId, testId },
      defaults: { score, time_taken }
    });

    if (!created) {
      // Only update if this score is better
      if (score > entry.score || (score === entry.score && time_taken < entry.time_taken)) {
        entry.score = score;
        entry.time_taken = time_taken;
        await entry.save();
      }
    }

    res.json({ message: 'Score submitted successfully', entry });
  } catch (err) {
    console.error('Leaderboard submission error:', err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
};

// GET /api/leaderboard/:testId
exports.getLeaderboard = async (req, res) => {
  const { testId } = req.params;

  try {
    const leaderboard = await Leaderboard.findAll({
      where: { testId },
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [
        ['score', 'DESC'],
        ['time_taken', 'ASC']
      ],
      limit: 10
    });

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

exports.getUserAttempts = async (req, res) => {
  try {
    const attempts = await Leaderboard.findAll({
      where: { userId: req.user.id },
      include: [{ model: Test, attributes: ['title'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(attempts);
  } catch (err) {
    console.error('Error fetching user attempts:', err);
    res.status(500).json({ error: 'Failed to fetch user attempts' });
  }
};

