const express = require('express');
const router = express.Router();

const AlbumController = require('../controllers/albumsController');

// routes
router.post('/tracks', AlbumController.getAlbumTracks);

module.exports = router;
