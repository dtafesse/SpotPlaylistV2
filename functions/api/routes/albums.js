const express = require("express");
const router = express.Router();

const AlbumController = require("../controllers/albumsController");

// routes
router.post(
  "/tracks",
  AlbumController.getAlbumTracks,
  AlbumController.suggestTracksBasedOnAlbumTracks
);

module.exports = router;
