const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');
const { validateSearch } = require('../middleware/validation');

/**
 * @route   POST /api/v1/search
 * @desc    Perform intelligent search using Perplexity AI
 * @access  Public
 * @body    { query, model?, max_tokens?, temperature?, top_p?, return_citations?, return_images?, recency_filter? }
 */
router.post('/', validateSearch, searchController.search);

/**
 * @route   GET /api/v1/search/models
 * @desc    Get available search models
 * @access  Public
 */
router.get('/models', searchController.getModels);

/**
 * @route   GET /api/v1/search/health
 * @desc    Check API health and Perplexity AI connectivity
 * @access  Public
 */
router.get('/health', searchController.checkHealth);

/**
 * @route   GET /api/v1/search/stats
 * @desc    Get search API statistics and usage
 * @access  Public
 */
router.get('/stats', searchController.getStats);

module.exports = router;