const express = require('express');
const bodyParser = require('body-parser');
const { authenticate } = require('../middleware/auth');
const {
  createCheckoutSession,
  handleWebhook
} = require('../controllers/purchaseController');
const Order = require('../models/Order'); 
 // Make sure Order model is imported

const router = express.Router();

// Start checkout (Stripe)
router.post('/checkout', authenticate, createCheckoutSession);

// Stripe webhook
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handleWebhook);

// Check if user purchased the quiz
router.get('/check/:testId', authenticate, async (req, res) => {
  const { testId } = req.params;

  try {
    const purchase = await Order.findOne({
      where: {
        userId: req.user.id,
        testId,
        status: 'completed',
      },
    });

    res.json({ purchased: !!purchase });
  } catch (error) {
    console.error('Error checking purchase:', error);
    res.status(500).json({ error: 'Server error checking purchase' });
  }
});

module.exports = router;

