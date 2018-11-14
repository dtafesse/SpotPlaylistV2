const express = require('express');
const router = express.Router();

const PlaylistController = require('../controllers/playlistController');

// routes
router.post('/save', PlaylistController.savePlaylist);

module.exports = router;
