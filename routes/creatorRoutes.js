const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getRevenue } = require('../controllers/creatorController');
const User = require('../models/User'); 

const router = express.Router();

// Get creator revenue:
router.get('/revenue', authenticate, getRevenue);

// Become a creator:
router.post('/become', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isCreator = true;
    await user.save();

        // New JWT with updated isCreator
    const newToken = require('jsonwebtoken').sign(
      { id: user.id, isCreator: user.isCreator },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, message: 'You are now a creator!', token: newToken });
  } catch (err) {
    console.error('Become Creator Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;