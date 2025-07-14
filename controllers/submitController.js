const Leaderboard = require('../models/Leaderboard');
const Test = require('../models/TestModel');
const User = require('../models/User');

exports.submitTest = async (req, res) => {
  const { testId, answers, timeTaken } = req.body;

  try {
    const test = await Test.findByPk(testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    let score = 0;

    test.solutions.forEach((solution, idx) => {
      if (
        answers[idx]?.trim().toLowerCase() ===
        solution.trim().toLowerCase()
      ) {
        score++;
      }
    });

    // Save score to leaderboard
    await Leaderboard.create({
      userId: req.user.id,
      testId,
      score,
      time_taken: Number(timeTaken) || 0 
    });

    res.json({ score, timeTaken });
  } catch (err) {
    console.error('Error submitting test:', err);
    res.status(500).json({ error: 'Server error during submission' });
  }
};

exports.getLeaderboard = async (req, res) => {
  const { testId } = req.params;

  try {
    const top = await Leaderboard.findAll({
      where: { testId },
      include: [
        {
          model: User,
          attributes: ['name'] // Include only name
        }
      ],
      order: [['score', 'DESC'], ['time_taken', 'ASC']],
      limit: 10
    });

    res.json(top);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
};


