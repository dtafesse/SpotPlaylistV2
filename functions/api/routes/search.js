const express = require('express');
const router = express.Router();

const SearchController = require('../controllers/searchController');

// routes
router.get('/:query', SearchController.search);

module.exports = router;
