const Test = require('../models/TestModel');

exports.createTest = async (req, res) => {
  const { title, description, questions, price, duration, solutions, type } = req.body;


  if (!req.user.isCreator) return res.status(403).json({ error: 'Creator account required' });

  const test = await Test.create({
    title,
    description,
    questions,
    price,
    duration,
    solutions,
    type, 
    creatorId: req.user.id
  });

  res.status(201).json(test);
};

exports.listTests = async (req, res) => {
  const tests = await Test.findAll({ include: ['creator'] });
  res.json(tests);
};

// Get single test by ID
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id, { include: ['creator'] });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err) {
    console.error('Error fetching test by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


