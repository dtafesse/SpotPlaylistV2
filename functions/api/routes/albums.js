const express = require('express');
const router = express.Router();

const AlbumController = require('../controllers/albumsController');

// routes
router.get('/:id', AlbumController.getAlbumTracks);

module.exports = router;
