const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Test = require('../models/TestModel');

exports.createCheckoutSession = async (req, res) => {
  const { testId } = req.body;
  const test = await Test.findByPk(testId);
  if (!test) return res.status(404).json({ error: 'Test not found' });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{ price_data: {
        currency: 'usd',
        product_data: { name: test.title },
        unit_amount: Math.round(test.price * 100),
      },
      quantity: 1,
    }],
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  });

  const order = await Order.create({
    amount: test.price,
    status: 'pending',
    userId: req.user.id,
    testId: test.id
  });

  res.json({ url: session.url });
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const order = await Order.findOne({ where: { status: 'pending' } });
    if (order) {
      order.status = 'completed';
      await order.save();
      const test = await Test.findByPk(order.testId);
      const creator = await test.getCreator();
      creator.wallet_balance += test.price * 0.9;
      await creator.save();
    }
  }
  res.sendStatus(200);
};
