const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User'); 

//  Register and Login routes
router.post('/register', registerController);
router.post('/login', loginController);

// Get current user details (for profile page)
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email']
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;

