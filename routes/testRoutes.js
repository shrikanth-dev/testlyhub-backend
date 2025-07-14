const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createTest, listTests, getTestById } = require('../controllers/testController'); // ✅ add getTestById

const router = express.Router();

// Create new test (protected)
router.post('/create', authenticate, createTest);

// List all tests (public)
router.get('/', listTests);

// Get single test by ID (public)
router.get('/:id', getTestById);

module.exports = router;

