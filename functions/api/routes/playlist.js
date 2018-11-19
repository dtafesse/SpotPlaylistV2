const express = require('express');
const router = express.Router();

const PlaylistController = require('../controllers/playlistController');

// routes
router.post('/create', PlaylistController.createPlaylist);
router.post('/addtracks', PlaylistController.addToPlaylist);

module.exports = router;
