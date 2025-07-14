const Order = require('../models/Order');
const Test = require('../models/TestModel');

exports.getRevenue = async (req, res) => {
  if (!req.user.isCreator) return res.status(403).json({ error: 'Not a creator' });
  const orders = await Order.findAll({
    include: [{ model: Test, where: { creatorId: req.user.id } }],
    where: { status: 'completed' }
  });
  const total = orders.reduce((sum, o) => sum + o.amount * 0.9, 0);
  res.json({ total, count: orders.length });
};
