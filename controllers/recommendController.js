const Test = require('../models/TestModel');
exports.getRecommendations = async (req, res) => {
  const all = await Test.findAll();
  const recs = all.filter(t => t.price <= 50); 
  res.json(recs);
};
